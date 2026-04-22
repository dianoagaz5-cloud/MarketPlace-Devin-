import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_PDF = ["application/pdf"];

function extFromType(type: string): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/avif") return "avif";
  if (type === "video/mp4") return "mp4";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  if (type === "application/pdf") return "pdf";
  return "bin";
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Connexion requise." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Stockage non configuré. Activez Vercel Blob : Dashboard Vercel → Storage → Create → Blob.",
      },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const kind = (form.get("kind") as string) || "image";

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Fichier manquant." }, { status: 400 });
  }

  let allowed: string[];
  let limit: number;
  if (kind === "video") {
    allowed = ALLOWED_VIDEO;
    limit = MAX_VIDEO_BYTES;
  } else if (kind === "pdf") {
    allowed = ALLOWED_PDF;
    limit = MAX_IMAGE_BYTES;
  } else {
    allowed = ALLOWED_IMAGE;
    limit = MAX_IMAGE_BYTES;
  }

  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Type de fichier non autorisé (${file.type}).` },
      { status: 400 },
    );
  }
  if (file.size > limit) {
    const mb = Math.round(limit / 1024 / 1024);
    return NextResponse.json(
      { ok: false, error: `Fichier trop lourd (max ${mb} Mo).` },
      { status: 400 },
    );
  }

  const ext = extFromType(file.type);
  const safeUser = user.id.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 24);
  const rand = Math.random().toString(36).slice(2, 10);
  const key = `uploads/${safeUser}/${Date.now()}-${rand}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return NextResponse.json({
    ok: true,
    url: blob.url,
    pathname: blob.pathname,
    contentType: file.type,
    size: file.size,
  });
}
