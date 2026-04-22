"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safe = images.filter(Boolean);
  const [active, setActive] = useState(0);
  if (safe.length === 0) {
    return <div className="aspect-square rounded-2xl bg-muted" />;
  }
  const current = safe[Math.min(active, safe.length - 1)];
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
        {isVideo(current) ? (
          <video
            src={current}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={name} className="h-full w-full object-cover" />
        )}
      </div>
      {safe.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {safe.slice(0, 5).map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "aspect-square w-full overflow-hidden rounded-lg border transition",
                active === i ? "ring-2 ring-primary border-primary" : "hover:border-primary/40",
              )}
            >
              {isVideo(item) ? (
                <video
                  src={item}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
