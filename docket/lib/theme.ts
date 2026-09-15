export type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "duebird-theme";

export function getStoredThemeChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function setStoredThemeChoice(choice: ThemeChoice) {
  localStorage.setItem(STORAGE_KEY, choice);
}

export function computeIsDark(choice: ThemeChoice): boolean {
  if (choice === "dark") return true;
  if (choice === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyStoredTheme() {
  const choice = getStoredThemeChoice();
  document.documentElement.classList.toggle("dark", computeIsDark(choice));
}