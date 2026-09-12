// A curated, flat, vibrant palette — students pick one when creating a class,
// everyone in that class sees the same color. Deliberately not an open color
// picker, so colors stay bold and readable rather than drifting into pale or
// clashing territory.
export const ACCENT_COLORS = [
  { id: "red", label: "Red", hex: "#E5484D" },
  { id: "orange", label: "Orange", hex: "#F2762E" },
  { id: "gold", label: "Gold", hex: "#E0A72E" },
  { id: "green", label: "Green", hex: "#29A344" },
  { id: "teal", label: "Teal", hex: "#12A594" },
  { id: "cyan", label: "Cyan", hex: "#1698C9" },
  { id: "blue", label: "Blue", hex: "#3B6FE0" },
  { id: "indigo", label: "Indigo", hex: "#5B5BD6" },
  { id: "violet", label: "Violet", hex: "#8355E8" },
  { id: "pink", label: "Pink", hex: "#E93D82" },
  { id: "charcoal", label: "Charcoal", hex: "#57534E" },
  { id: "bone", label: "Bone", hex: "#D9CFC0" },
] as const;

export type AccentColorId = (typeof ACCENT_COLORS)[number]["id"];

const BY_ID = new Map(ACCENT_COLORS.map((c) => [c.id, c]));

export function accentHex(id: string): string {
  return BY_ID.get(id as AccentColorId)?.hex ?? ACCENT_COLORS[0].hex;
}
