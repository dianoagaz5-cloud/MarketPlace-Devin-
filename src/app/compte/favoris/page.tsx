"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavorites, type FavoriteItem } from "@/lib/favorites";
import { formatFCFA } from "@/lib/money";

function hrefFor(item: FavoriteItem): string {
  if (item.kind === "PRODUCT") return `/produit/${item.slug}`;
  if (item.kind === "SERVICE") return `/service/${item.slug}`;
  return `/ebook/${item.slug}`;
}

function kindLabel(kind: FavoriteItem["kind"]): string {
  if (kind === "PRODUCT") return "Produit";
  if (kind === "SERVICE") return "Service";
  return "Ebook";
}

export default function FavoritesPage() {
  const { items, remove, clear } = useFavorites();

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Heart size={24} className="text-red-500 fill-current" /> Mes favoris
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} article{items.length > 1 ? "s" : ""} sauvegardé
            {items.length > 1 ? "s" : ""} sur cet appareil.
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clear();
              toast.info("Favoris vidés");
            }}
          >
            Tout retirer
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border bg-card p-10 text-center">
          <Heart size={32} className="mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Aucun favori pour l&apos;instant. Cliquez sur le cœur d&apos;un article pour
            l&apos;enregistrer ici.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/boutique">
              <Button size="sm">Explorer la boutique</Button>
            </Link>
            <Link href="/services">
              <Button size="sm" variant="outline">Voir les services</Button>
            </Link>
            <Link href="/ebooks">
              <Button size="sm" variant="outline">Ebooks</Button>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((f) => (
            <li
              key={`${f.kind}-${f.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 hover:border-primary/40"
            >
              <Link
                href={hrefFor(f)}
                className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                {f.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image} alt={f.name} className="h-full w-full object-cover" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {kindLabel(f.kind)}
                </div>
                <Link
                  href={hrefFor(f)}
                  className="line-clamp-2 text-sm font-medium hover:text-primary"
                >
                  {f.name}
                </Link>
                <div className="mt-1 text-xs text-muted-foreground truncate">
                  par {f.sellerName}
                </div>
                <div className="mt-1 text-sm font-bold text-primary">
                  {formatFCFA(f.price)}
                </div>
              </div>
              <button
                type="button"
                aria-label="Retirer"
                onClick={() => {
                  remove(f.kind, f.id);
                  toast.info("Retiré des favoris");
                }}
                className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
