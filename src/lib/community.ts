export const COMMUNITY_PROMPTS = [
  "What are the first 3 things you buy for a two-week blackout?",
  "How much water do you keep stored right now?",
  "What is one item every basic med kit should have?",
  "What backup lighting setup do you actually trust?",
];

const DISPLAY_LABELS: Record<string, string> = {
  "general preparedness": "General Preparedness",
  generalpreparedness: "General Preparedness",
  "power outages": "Power Outages",
  poweroutages: "Power Outages",
  "water filtration": "Water & Filtration",
  waterfiltration: "Water & Filtration",
  water: "Water & Filtration",
  filtration: "Water & Filtration",
  "food storage": "Food Storage",
  foodstorage: "Food Storage",
  medical: "Medical & First Aid",
  "medical first aid": "Medical & First Aid",
  medicalfirstaid: "Medical & First Aid",
  "medical / first aid": "Medical & First Aid",
  comms: "Communications",
  coms: "Communications",
  communication: "Communications",
  communications: "Communications",
  "communication gear": "Communications",
  "off grid living": "Off-Grid Living",
  offgridliving: "Off-Grid Living",
  homesteading: "Homesteading",
  security: "Security",
};

function cleanupLabel(input: string) {
  return input
    .replace(/[_/]+/g, " ")
    .replace(/&/g, " and ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function titleCase(input: string) {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCommunityLabel(label?: string | null) {
  if (!label) return "Preparedness";

  const cleaned = cleanupLabel(label);
  const compact = cleaned.replace(/\s+/g, "");

  return DISPLAY_LABELS[cleaned] || DISPLAY_LABELS[compact] || titleCase(cleaned);
}

export function buildTopicValue(label: string) {
  return cleanupLabel(formatCommunityLabel(label)).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function matchesTopic(haystack: string, topic: string) {
  const normalizedHaystack = cleanupLabel(haystack);
  const normalizedTopic = cleanupLabel(topic);
  return normalizedHaystack.includes(normalizedTopic.replace(/-/g, " "));
}

export function isActiveDiscussion(
  post: { comments: number; likes: number },
  options?: { minComments?: number; minLikes?: number }
) {
  const minComments = options?.minComments ?? 1;
  const minLikes = options?.minLikes ?? 3;
  return post.comments >= minComments || post.likes >= minLikes;
}

function getRecencyBonus(createdAt?: string) {
  if (!createdAt) return 0;
  const ms = Date.now() - new Date(createdAt).getTime();
  const hours = ms / (1000 * 60 * 60);

  if (hours <= 24) return 6;
  if (hours <= 72) return 4;
  if (hours <= 24 * 7) return 2;
  if (hours <= 24 * 14) return 1;
  return 0;
}

export function computeForYouScore(post: { comments: number; likes: number; createdAt?: string }, followingBoost = false) {
  return post.comments * 5 + post.likes * 2 + getRecencyBonus(post.createdAt) + (followingBoost ? 3 : 0);
}

export function dedupeTopicItems<T extends { label: string; href: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = buildTopicValue(item.label);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
