"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Passer en thème clair" : "Passer en thème sombre"}
      onClick={toggle}
      className="rounded-lg p-2 hover:bg-muted transition"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
