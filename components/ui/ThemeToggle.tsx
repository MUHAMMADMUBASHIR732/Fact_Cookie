// Light/dark switch button.
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center rounded-xl border border-line text-muted transition hover:text-text">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
