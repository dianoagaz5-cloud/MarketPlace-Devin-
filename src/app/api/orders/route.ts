import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword, createSession } from "@/lib/auth";
import { getSettings, computeCommission } from "@/lib/commission";
import { initiateMockPayment, type PaymentProvider } from "@/lib/payment";
import { buildOrderNumber, parseImages } from "@/lib/utils";
import crypto from "crypto";

const schema = z.object({
  items: z.array(
    z.object({
      kind: z.enum(["PRODUCT", "SERVICE", "EBOOK"]),
      id: z.string(),
      quantity: z.number().min(1).max(99),
    }),
  ).min(1),
  contact: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().min(2),
    note: z.string().optional(),
  }),
  payment: z.object({
    provider: z.enum(["MTN_MOMO", "MOOV_MONEY", "CELTIIS_CASH"]),
    phone: z.string().min(6),
  }),
});

const CITY_FEES: Record<string, number> = {
  Cotonou: 1500,
  "Abomey-Calavi": 2000,
  "Porto-Novo": 2500,
  Ouidah: 3000,
  Parakou: 5000,
  "Autre (national)": 5000,
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Données invalides." }, { status: 400 });
  }
  const { items, contact, payment } = parsed.data;

  let user = await getCurrentUser();
  let guestSessionCreated = false;
  if (!user) {
    if (!contact.email) {
      return NextResponse.json(
        { ok: false, error: "Email requis pour les invités." },
        { status: 400 },
      );
    }
    const existing = await prisma.user.findUnique({
      where: { email: contact.email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "Un compte existe déjà avec cet email. Veuillez vous connecter pour commander.",
        },
        { status: 409 },
      );
    }
    {
      const created = await prisma.user.create({
        data: {
          email: contact.email,
          name: contact.fullName,
          phone: contact.phone,
          city: contact.city,
          passwordHash: await hashPassword(crypto.randomBytes(16).toString("hex")),
          role: "CLIENT",
        },
        include: { seller: true },
      });
      user = created;
      guestSessionCreated = true;
    }
  }

  const resolved: {
    kind: "PRODUCT" | "SERVICE" | "EBOOK";
    id: string;
    sellerId: string;
    name: string;
    image: string | null;
    unitPrice: number;
    quantity: number;
  }[] = [];

  let subtotal = 0;
  let hasPhysical = false;

  for (const it of items) {
    if (it.kind === "PRODUCT") {
      const p = await prisma.product.findUnique({ where: { id: it.id } });
      if (!p || p.status !== "APPROVED") {
        return NextResponse.json({ ok: false, error: `Produit indisponible` }, { status: 400 });
      }
      if (p.stock < it.quantity) {
        return NextResponse.json({ ok: false, error: `Stock insuffisant pour ${p.name}` }, { status: 400 });
      }
      resolved.push({
        kind: "PRODUCT",
        id: p.id,
        sellerId: p.sellerId,
        name: p.name,
        image: parseImages(p.images)[0] ?? null,
        unitPrice: p.price,
        quantity: it.quantity,
      });
      subtotal += p.price * it.quantity;
      hasPhysical = true;
    } else if (it.kind === "SERVICE") {
      const s = await prisma.service.findUnique({ where: { id: it.id } });
      if (!s || s.status !== "APPROVED") {
        return NextResponse.json({ ok: false, error: `Service indisponible` }, { status: 400 });
      }
      resolved.push({
        kind: "SERVICE",
        id: s.id,
        sellerId: s.sellerId,
        name: s.name,
        image: parseImages(s.images)[0] ?? null,
        unitPrice: s.price,
        quantity: 1,
      });
      subtotal += s.price;
    } else {
      const e = await prisma.ebook.findUnique({ where: { id: it.id } });
      if (!e || e.status !== "APPROVED") {
        return NextResponse.json({ ok: false, error: `Ebook indisponible` }, { status: 400 });
      }
      resolved.push({
        kind: "EBOOK",
        id: e.id,
        sellerId: e.sellerId,
        name: e.title,
        image: e.cover,
        unitPrice: e.price,
        quantity: 1,
      });
      subtotal += e.price;
    }
  }

  const shipping = !hasPhysical ? 0 : subtotal >= 50_000 ? 0 : CITY_FEES[contact.city] ?? 5000;
  const total = subtotal + shipping;

  const settings = await getSettings();
  const commission = computeCommission(subtotal, settings.commissionPercent);

  const result = await initiateMockPayment({
    provider: payment.provider as PaymentProvider,
    phone: payment.phone,
    amount: total,
  });
  const status = result.ok ? "PAID" : "PENDING";

  const order = await prisma.order.create({
    data: {
      number: buildOrderNumber(),
      userId: user.id,
      status,
      subtotal,
      shipping,
      commission,
      total,
      paymentProvider: payment.provider,
      paymentRef: result.ref,
      phone: contact.phone,
      shippingCity: contact.city,
      shippingAddress: contact.address ?? "",
      note: contact.note,
      items: {
        create: resolved.map((r) => ({
          kind: r.kind,
          sellerId: r.sellerId,
          productId: r.kind === "PRODUCT" ? r.id : null,
          serviceId: r.kind === "SERVICE" ? r.id : null,
          ebookId: r.kind === "EBOOK" ? r.id : null,
          name: r.name,
          image: r.image,
          price: r.unitPrice,
          quantity: r.quantity,
        })),
      },
    },
  });

  if (status === "PAID") {
    try {
      await prisma.$transaction(async (tx) => {
        for (const r of resolved) {
          if (r.kind === "PRODUCT") {
            const dec = await tx.product.updateMany({
              where: { id: r.id, stock: { gte: r.quantity } },
              data: { stock: { decrement: r.quantity }, soldCount: { increment: r.quantity } },
            });
            if (dec.count === 0) throw new Error(`STOCK_INSUFFICIENT:${r.name}`);
          } else if (r.kind === "SERVICE") {
            await tx.service.update({ where: { id: r.id }, data: { soldCount: { increment: 1 } } });
          } else {
            await tx.ebook.update({ where: { id: r.id }, data: { soldCount: { increment: 1 } } });
            const token = crypto.randomBytes(24).toString("hex");
            const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
            await tx.ebookDownloadToken.create({
              data: {
                token,
                ebookId: r.id,
                orderId: order.id,
                maxUses: 3,
                expiresAt,
              },
            });
          }
          const itemTotal = r.unitPrice * r.quantity;
          const itemCommission = computeCommission(itemTotal, settings.commissionPercent);
          const credit = itemTotal - itemCommission;
          await tx.seller.update({
            where: { id: r.sellerId },
            data: { balance: { increment: credit } },
          });
        }
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.startsWith("STOCK_INSUFFICIENT:")) {
        const name = msg.slice("STOCK_INSUFFICIENT:".length) || "article";
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PENDING",
            note: `${contact.note ?? ""}\n[Stock insuffisant sur ${name} — commande à revalider]`.trim(),
          },
        });
        return NextResponse.json(
          { ok: false, error: `Stock insuffisant pour ${name}`, orderId: order.id },
          { status: 409 },
        );
      }
      throw e;
    }
  }

  if (guestSessionCreated && user) {
    await createSession(user);
  }

  return NextResponse.json({ ok: true, orderId: order.id, status });
}
