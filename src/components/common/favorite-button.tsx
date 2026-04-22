"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFavorites, type FavoriteItem } from "@/lib/favorites";

type Props = {
  item: Omit<FavoriteItem, "addedAt">;
  className?: string;
  iconSize?: number;
};

export function FavoriteButton({ item, className, iconSize = 14 }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(item.kind, item.id);

  return (
    <button
      type="button"
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const result = toggle(item);
        if (result === "added") toast.success("Ajouté aux favoris");
        else toast.info("Retiré des favoris");
      }}
      className={cn(
        "grid place-items-center rounded-full p-2 shadow transition-colors",
        active
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/90 text-foreground hover:bg-white dark:bg-card/90 dark:hover:bg-card",
        className,
      )}
    >
      <Heart
        size={iconSize}
        className={cn("transition-transform", active && "fill-current")}
      />
    </button>
  );
}
