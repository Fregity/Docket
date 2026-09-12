"use client";

import { useEffect, useState } from "react";

type ThemeChoice = "light" | "dark" | "system";

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function applyTheme(choice: ThemeChoice) {
  const isDark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    const stored = localStorage.getItem("docket-theme") as ThemeChoice | null;
    if (stored) setChoice(stored);
  }, []);

  function handleChange(next: ThemeChoice) {
    setChoice(next);
    localStorage.setItem("docket-theme", next);
    applyTheme(next);
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