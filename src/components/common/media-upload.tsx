"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Upload, X, Image as ImageIcon, Video, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type UploadKind = "image" | "video" | "pdf";

type Props = {
  kind?: UploadKind;
  multiple?: boolean;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
  hint?: string;
};

function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}
function isPdf(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}

export function MediaUpload({
  kind = "image",
  multiple = false,
  value,
  onChange,
  max = 6,
  label = "Ajouter des fichiers",
  hint,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept =
    kind === "video"
      ? "video/mp4,video/webm,video/quicktime"
      : kind === "pdf"
        ? "application/pdf"
        : "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm";

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      const remaining = Math.max(0, max - value.length);
      const take = multiple ? list.slice(0, remaining) : list.slice(0, 1);
      if (take.length === 0) {
        toast.error(`Limite atteinte (${max} fichiers).`);
        return;
      }
      setBusy(true);
      const uploaded: string[] = [];
      for (const file of take) {
        const fd = new FormData();
        fd.append("file", file);
        const thisKind: UploadKind = file.type.startsWith("video/")
          ? "video"
          : file.type === "application/pdf"
            ? "pdf"
            : "image";
        fd.append("kind", thisKind);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!data.ok) {
            toast.error(data.error || "Échec de l'upload");
            continue;
          }
          uploaded.push(data.url);
        } catch {
          toast.error("Erreur réseau pendant l'upload");
        }
      }
      if (uploaded.length) {
        onChange(multiple ? [...value, ...uploaded] : uploaded);
        toast.success(
          uploaded.length === 1
            ? "Fichier ajouté"
            : `${uploaded.length} fichiers ajoutés`,
        );
      }
      setBusy(false);
    },
    [max, multiple, onChange, value],
  );

  function removeAt(i: number) {
    const copy = value.slice();
    copy.splice(i, 1);
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
        }}
        disabled={busy}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/40",
          busy && "opacity-50 cursor-wait",
        )}
      >
        {busy ? (
          <Loader2 className="animate-spin" size={22} />
        ) : (
          <Upload size={22} className="text-muted-foreground" />
        )}
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {hint ??
            (kind === "video"
              ? "MP4, WebM, MOV · 30 Mo max"
              : kind === "pdf"
                ? "PDF · 8 Mo max"
                : "JPG, PNG, WebP, GIF ou vidéo MP4/WebM · 8 Mo (image) / 30 Mo (vidéo)")}
        </span>
        <span className="text-xs text-muted-foreground">
          Glisser-déposer ou cliquer pour choisir
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />

      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="relative aspect-square overflow-hidden rounded-lg border bg-muted group"
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : isPdf(url) ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <FileText size={22} />
                  <span className="text-[10px]">PDF</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1 text-[10px] text-white">
                <span className="inline-flex items-center gap-1">
                  {isVideo(url) ? (
                    <>
                      <Video size={10} /> Vidéo
                    </>
                  ) : isPdf(url) ? (
                    <>
                      <FileText size={10} /> PDF
                    </>
                  ) : (
                    <>
                      <ImageIcon size={10} /> Image
                    </>
                  )}
                </span>
              </div>
              <button
                type="button"
                aria-label="Retirer"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
