"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

const STORAGE_KEY = "drill-rig-app";

function readThemeFromStorage(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "light";
    const data = JSON.parse(raw);
    return data?.state?.theme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeSync() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return null;
}

/** Call from inline script in layout to avoid theme flash before React hydrates */
export function applyThemeFromStorage() {
  const t = readThemeFromStorage();
  if (t === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}
