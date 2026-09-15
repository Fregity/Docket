"use client";

import { useEffect, useState } from "react";
import {
  type ThemeChoice,
  getStoredThemeChoice,
  setStoredThemeChoice,
  computeIsDark,
} from "@/lib/theme";

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    setChoice(getStoredThemeChoice());
  }, []);

  function handleChange(next: ThemeChoice) {
    setChoice(next);
    setStoredThemeChoice(next);
    document.documentElement.classList.toggle("dark", computeIsDark(next));
  }

  return (
    <div>
      <label className="label">Appearance</label>
      <div className="inline-flex rounded-xl border border-hairline p-1 gap-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors ${
              choice === opt.value ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}