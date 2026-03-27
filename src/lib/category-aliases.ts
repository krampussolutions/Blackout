export const CATEGORY_ALIASES: Record<string, string> = {
  communication: "comms",
  communications: "comms",
  comms: "comms",
  "power-outage": "power-outages",
  outage: "power-outages",
  outages: "power-outages",
  water: "water-filtration",
  filtration: "water-filtration",
  medicals: "medical",
};

export function normalizeCategorySlug(input: string) {
  const cleaned = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return CATEGORY_ALIASES[cleaned] || cleaned;
}
