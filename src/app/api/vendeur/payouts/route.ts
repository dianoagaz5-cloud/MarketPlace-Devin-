import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getSettings } from "@/lib/commission";

const schema = z.object({
  amount: z.number().int().min(1),
  provider: z.enum(["MTN_MOMO", "MOOV_MONEY", "CELTIIS_CASH"]),
  phone: z.string().min(6),
});

export async function POST(req: Request) {
  const user = await requireRole(["VENDEUR"]).catch(() => null);
  if (!user) return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
  const seller = await prisma.seller.findUnique({ where: { userId: user.id } });
  if (!seller) return NextResponse.json({ ok: false, error: "Profil vendeur manquant" }, { status: 400 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message }, { status: 400 });
  const { amount, provider, phone } = parsed.data;

  const settings = await getSettings();
  if (amount < settings.minPayoutAmount) {
    return NextResponse.json({ ok: false, error: `Minimum ${settings.minPayoutAmount} FCFA` }, { status: 400 });
  }
  if (amount > seller.balance) {
    return NextResponse.json({ ok: false, error: "Solde insuffisant" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.seller.update({ where: { id: seller.id }, data: { balance: { decrement: amount } } }),
    prisma.payout.create({
      data: {
        sellerId: seller.id,
        amount,
        provider,
        phone,
        status: "PENDING",
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
