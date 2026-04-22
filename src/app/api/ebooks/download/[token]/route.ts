import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;

  const tok = await prisma.ebookDownloadToken.findUnique({
    where: { token },
    include: { ebook: true },
  });

  if (!tok) {
    return NextResponse.json({ ok: false, error: "Lien invalide." }, { status: 404 });
  }
  if (tok.expiresAt < new Date()) {
    return NextResponse.json({ ok: false, error: "Lien expiré." }, { status: 410 });
  }
  if (tok.uses >= tok.maxUses) {
    return NextResponse.json({ ok: false, error: "Nombre max de téléchargements atteint." }, { status: 410 });
  }

  const updated = await prisma.ebookDownloadToken.updateMany({
    where: {
      id: tok.id,
      uses: { lt: tok.maxUses },
      expiresAt: { gt: new Date() },
    },
    data: { uses: { increment: 1 } },
  });
  if (updated.count === 0) {
    return NextResponse.json({ ok: false, error: "Nombre max de téléchargements atteint." }, { status: 410 });
  }

  // For MVP we redirect to the stored fileUrl. In production this would be a signed cloud URL.
  const origin = new URL(_req.url).origin;
  const fileUrl = tok.ebook.fileUrl;
  const absolute = /^https?:\/\//i.test(fileUrl) ? fileUrl : new URL(fileUrl, origin).toString();
  return NextResponse.redirect(absolute);
}
