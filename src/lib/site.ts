export const siteConfig = {
  name: "Blackout Network",
  description:
    "A social network for preppers, survivalists, off-grid families, and self-reliance communities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export type MemberProfile = {
  id?: string;
  username: string;
  displayName: string;
  bio: string;
  location: string;
  avatar: string;
  avatarUrl?: string | null;
  cover: string;
  coverUrl?: string | null;
  interests: string[];
  followers: number;
  following: number;
  posts: number;
  joinedLabel: string;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
  membershipTier?: string;
};

export const categories = [
  {
    name: "General Preparedness",
    slug: "general-preparedness",
    description: "Core planning, checklists, and all-around readiness."
  },
  {
    name: "Power Outages",
    slug: "power-outages",
    description: "Grid-down planning, generators, lighting, and fuel storage."
  },
  {
    name: "Water & Filtration",
    slug: "water-filtration",
    description: "Storage, purification, gravity filters, and backup supply plans."
  },
  {
    name: "Food Storage",
    slug: "food-storage",
    description: "Pantry rotation, long-term storage, freeze-dried food, and canning."
  },
  {
    name: "Medical",
    slug: "medical",
    description: "First aid kits, trauma prep, prescriptions, and field care basics."
  },
  {
    name: "Comms",
    slug: "comms",
    description: "Ham radio, emergency signals, batteries, and off-grid communications."
  }
];

export const memberProfiles: MemberProfile[] = [
  {
    username: "ridgewalker",
    displayName: "Ridge Walker",
    bio: "Storm prep, backup power, radios, and mountain self-reliance.",
    location: "Western North Carolina",
    avatar: "RW",
    cover: "from-slate-700 via-slate-800 to-zinc-950",
    interests: ["Backup Power", "Ham Radio", "Storm Prep"],
    followers: 248,
    following: 91,
    posts: 34,
    joinedLabel: "Joined January 2026",
    isFollowing: false
  },
  {
    username: "oakhollowhomestead",
    displayName: "Oak Hollow Homestead",
    bio: "Pantry rotation, canning, livestock basics, and practical homestead systems.",
    location: "North Georgia",
    avatar: "OH",
    cover: "from-emerald-800 via-lime-900 to-zinc-950",
    interests: ["Food Storage", "Canning", "Homestead"],
    followers: 402,
    following: 133,
    posts: 58,
    joinedLabel: "Joined December 2025",
    isFollowing: true
  },
  {
    username: "emberline",
    displayName: "Ember Line",
    bio: "Water systems, med kits, bug-out loadouts, and family preparedness drills.",
    location: "East Tennessee",
    avatar: "EL",
    cover: "from-amber-700 via-orange-900 to-zinc-950",
    interests: ["Water", "Medical", "Bug Out"],
    followers: 319,
    following: 77,
    posts: 41,
    joinedLabel: "Joined November 2025",
    isFollowing: true
  },
  {
    username: "quietsignal",
    displayName: "Quiet Signal",
    bio: "Comms planning, battery redundancy, and quiet neighborhood response teams.",
    location: "South Carolina",
    avatar: "QS",
    cover: "from-cyan-800 via-sky-900 to-zinc-950",
    interests: ["Comms", "Batteries", "Neighborhood Plans"],
    followers: 166,
    following: 124,
    posts: 19,
    joinedLabel: "Joined February 2026",
    isFollowing: false
  }
];

export const samplePosts = [
  {
    id: "1",
    title: "Best backup lighting setup for a 3-day outage?",
    category: "Power Outages",
    author: "ridgewalker",
    excerpt: "Looking for a reliable mix of lanterns, headlamps, and battery storage without overspending.",
    comments: 14,
    likes: 38
  },
  {
    id: "2",
    title: "How often are you rotating your long-term food stores?",
    category: "Food Storage",
    author: "oakhollowhomestead",
    excerpt: "Trying to build a better pantry rotation schedule before storm season starts.",
    comments: 9,
    likes: 24
  },
  {
    id: "3",
    title: "Water filter recommendations for family of four",
    category: "Water & Filtration",
    author: "emberline",
    excerpt: "Comparing gravity systems vs pump filters for home use and bug-out kits.",
    comments: 21,
    likes: 47
  }
];

export const groups = [
  { name: 'Blackout Reports', description: 'Storm prep, outages, and live situation updates.' },
  { name: 'Off-Grid Builds', description: 'Solar, battery banks, heating, and water systems.' },
  { name: 'Food & Pantry', description: 'Storage systems, canning, freeze-dried, and rotation.' }
];

export const rightRailTopics = [
  '72-hour kits',
  'solar generators',
  'ham radio',
  'water storage',
  'medical kits'
];

export function getMemberProfile(username: string) {
  return memberProfiles.find((profile) => profile.username === username);
}
