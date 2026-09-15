"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { applyStoredTheme } from "@/lib/theme";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ThemeSync() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    applyStoredTheme();
  }, [pathname]);

  return null;
}