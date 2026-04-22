"use client";

import { useCallback, useEffect, useState } from "react";

export type FavoriteKind = "PRODUCT" | "SERVICE" | "EBOOK";

export type FavoriteItem = {
  kind: FavoriteKind;
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  sellerName: string;
  addedAt: number;
};

const KEY = "mkt_favorites_v1";

function read(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function write(items: FavoriteItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("mkt:favorites"));
}

export function useFavorites() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setItems(read());
    const handler = () => setItems(read());
    window.addEventListener("mkt:favorites", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mkt:favorites", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isFavorite = useCallback((kind: FavoriteKind, id: string) => {
    return items.some((f) => f.kind === kind && f.id === id);
  }, [items]);

  const toggle = useCallback(
    (item: Omit<FavoriteItem, "addedAt">): "added" | "removed" => {
      const current = read();
      const idx = current.findIndex(
        (f) => f.kind === item.kind && f.id === item.id,
      );
      if (idx >= 0) {
        current.splice(idx, 1);
        write(current);
        return "removed";
      }
      current.unshift({ ...item, addedAt: Date.now() });
      write(current);
      return "added";
    },
    [],
  );

  const remove = useCallback((kind: FavoriteKind, id: string) => {
    write(read().filter((f) => !(f.kind === kind && f.id === id)));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { items, isFavorite, toggle, remove, clear, count: items.length };
}
