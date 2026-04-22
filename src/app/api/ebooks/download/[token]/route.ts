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

  await prisma.ebookDownloadToken.update({
    where: { id: tok.id },
    data: { uses: { increment: 1 } },
  });

  // For MVP we redirect to the stored fileUrl. In production this would be a signed cloud URL.
  return NextResponse.redirect(tok.ebook.fileUrl);
}
