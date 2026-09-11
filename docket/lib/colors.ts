// A curated, flat, muted palette — students pick one when creating a class,
// everyone in that class sees the same color. Deliberately not an open color
// picker, so no class can end up neon-green-on-white.
export const ACCENT_COLORS = [
  { id: "olive", label: "Olive", hex: "#6E7A4F" },
  { id: "terracotta", label: "Terracotta", hex: "#BD6A3E" },
  { id: "clay", label: "Clay", hex: "#A9714E" },
  { id: "dusty-blue", label: "Dusty Blue", hex: "#5C7C99" },
  { id: "sage", label: "Sage", hex: "#7C8F6E" },
  { id: "ochre", label: "Ochre", hex: "#C1943E" },
  { id: "plum", label: "Plum", hex: "#7A5C74" },
  { id: "slate", label: "Slate", hex: "#56636E" },
  { id: "rust", label: "Rust", hex: "#9C4A32" },
  { id: "fern", label: "Fern", hex: "#5F7A5E" },
] as const;

export type AccentColorId = (typeof ACCENT_COLORS)[number]["id"];

const BY_ID = new Map(ACCENT_COLORS.map((c) => [c.id, c]));

export function accentHex(id: string): string {
  return BY_ID.get(id as AccentColorId)?.hex ?? ACCENT_COLORS[0].hex;
}
