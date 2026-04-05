export const siteConfig = {
  name: "Blackout Network",
  description:
    "A social network for preppers, survivalists, off-grid families, and self-reliance communities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
  founderBadgeEarned?: boolean;
};

export const categories = [
  {
    name: "General Preparedness",
    slug: "general-preparedness",
    description: "Core planning, checklists, and all-around readiness.",
  },
  {
    name: "Power Outages",
    slug: "power-outages",
    description: "Grid-down planning, generators, lighting, and fuel storage.",
  },
  {
    name: "Water & Filtration",
    slug: "water-filtration",
    description: "Storage, purification, gravity filters, and backup supply plans.",
  },
  {
    name: "Food Storage",
    slug: "food-storage",
    description: "Pantry rotation, long-term storage, freeze-dried food, and canning.",
  },
  {
    name: "Medical",
    slug: "medical",
    description: "First aid kits, trauma prep, prescriptions, and field care basics.",
  },
  {
    name: "Comms",
    slug: "comms",
    description: "Ham radio, emergency signals, batteries, and off-grid communications.",
  },
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
    isFollowing: false,
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
    isFollowing: true,
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
    isFollowing: true,
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
    isFollowing: false,
  },
  {
    username: "wulfsige",
    displayName: "Wulfsige",
    bio: "Cold-weather layering, camp cook systems, and practical winter readiness.",
    location: "Virginia",
    avatar: "WU",
    cover: "from-zinc-700 via-slate-900 to-black",
    interests: ["Winter Prep", "Cooking", "Camp Systems"],
    followers: 141,
    following: 82,
    posts: 17,
    joinedLabel: "Joined February 2026",
    isFollowing: true,
  },
  {
    username: "matt",
    displayName: "matt",
    bio: "Building preparedness systems, social tools, and practical blackout planning workflows.",
    location: "North Carolina",
    avatar: "MA",
    cover: "from-slate-800 via-zinc-900 to-black",
    interests: ["Outages", "Community", "Resilience"],
    followers: 18,
    following: 12,
    posts: 5,
    joinedLabel: "Joined March 2026",
    isFollowing: true,
  },
  {
    username: "fieldnotesfarm",
    displayName: "Field Notes Farm",
    bio: "Garden systems, pressure canning, pantry planning, and practical homestead routines.",
    location: "Tennessee",
    avatar: "FN",
    cover: "from-lime-800 via-emerald-900 to-zinc-950",
    interests: ["Gardening", "Pantry", "Canning"],
    followers: 213,
    following: 57,
    posts: 28,
    joinedLabel: "Joined January 2026",
    isFollowing: false,
  },
  {
    username: "blueember",
    displayName: "Blue Ember",
    bio: "Emergency lighting, battery boxes, radios, and blackout comfort upgrades.",
    location: "Georgia",
    avatar: "BE",
    cover: "from-blue-900 via-slate-900 to-black",
    interests: ["Lighting", "Battery Backup", "Radios"],
    followers: 132,
    following: 49,
    posts: 16,
    joinedLabel: "Joined February 2026",
    isFollowing: false,
  },
];

export const samplePosts = [
  { id: "1", title: "Best backup lighting setup for a 3-day outage?", category: "Power Outages", author: "ridgewalker", excerpt: "Looking for a reliable mix of lanterns, headlamps, and battery storage without overspending.", comments: 14, likes: 38 },
  { id: "2", title: "How often are you rotating your long-term food stores?", category: "Food Storage", author: "oakhollowhomestead", excerpt: "Trying to build a better pantry rotation schedule before storm season starts.", comments: 9, likes: 24 },
  { id: "3", title: "Water filter recommendations for family of four", category: "Water & Filtration", author: "emberline", excerpt: "Comparing gravity systems vs pump filters for home use and bug-out kits.", comments: 21, likes: 47 },
  { id: "4", title: "Simple family comms plan for short outages", category: "Comms", author: "quietsignal", excerpt: "Looking for a basic check-in routine that works when cell service gets spotty during storms.", comments: 11, likes: 19 },
  { id: "5", title: "What is actually worth keeping in a vehicle kit?", category: "General Preparedness", author: "wulfsige", excerpt: "Trying to keep a seasonal vehicle kit compact without losing the stuff that matters.", comments: 8, likes: 17 },
  { id: "6", title: "Pantry staples I rotate every month", category: "Food Storage", author: "fieldnotesfarm", excerpt: "A simple monthly rotation rhythm has helped me avoid waste and keep meals realistic.", comments: 16, likes: 33 },
  { id: "7", title: "Favorite lantern setup for room lighting", category: "Power Outages", author: "blueember", excerpt: "Warm room lighting helps morale more than bright tactical flashlights in longer outages.", comments: 12, likes: 26 },
  { id: "8", title: "Gravity filter vs countertop purifier", category: "Water & Filtration", author: "emberline", excerpt: "What has been more practical for your household, especially when power is out for more than one day?", comments: 13, likes: 29 },
  { id: "9", title: "Medical kit mistakes beginners make", category: "Medical", author: "ridgewalker", excerpt: "I see a lot of oversized kits with no real plan behind them. What are the essentials you actually use?", comments: 18, likes: 42 },
  { id: "10", title: "Quiet cooking options during a blackout", category: "General Preparedness", author: "wulfsige", excerpt: "Looking for low-fuss cooking setups that are safe, simple, and easy to store indoors and out.", comments: 10, likes: 21 },
  { id: "11", title: "What foods hold up best for pantry comfort meals?", category: "Food Storage", author: "oakhollowhomestead", excerpt: "Trying to stock more than just rice and beans so the pantry still feels livable after a rough week.", comments: 15, likes: 31 },
  { id: "12", title: "Radios worth buying before storm season", category: "Comms", author: "quietsignal", excerpt: "Looking for dependable options for local updates, weather, and family check-ins.", comments: 17, likes: 28 },
  { id: "13", title: "How I organize flashlight batteries by room", category: "Power Outages", author: "blueember", excerpt: "A simple room-based battery box system has reduced chaos every time the grid goes down.", comments: 7, likes: 15 },
  { id: "14", title: "Beginner pressure canning workflow", category: "Food Storage", author: "fieldnotesfarm", excerpt: "What steps helped you feel confident the first few times you canned meals or meat?", comments: 9, likes: 18 },
  { id: "15", title: "Water storage for apartments", category: "Water & Filtration", author: "matt", excerpt: "I want a practical apartment setup that does not eat all the floor space. What containers are worth it?", comments: 14, likes: 22 },
  { id: "16", title: "How often do you test backup power?", category: "Power Outages", author: "ridgewalker", excerpt: "Trying to make generator and battery checks a routine instead of something I only think about during storms.", comments: 13, likes: 30 },
  { id: "17", title: "Best ways to label stored food clearly", category: "Food Storage", author: "fieldnotesfarm", excerpt: "I want a system the whole household can follow without having to ask where anything goes.", comments: 8, likes: 16 },
  { id: "18", title: "Simple family evacuation info sheet", category: "General Preparedness", author: "matt", excerpt: "A one-page sheet with contacts, meetup spots, and important numbers seems worth keeping in every bag.", comments: 12, likes: 20 },
  { id: "19", title: "What do you actually carry in an IFAK?", category: "Medical", author: "emberline", excerpt: "Curious what people keep in their real kits versus what only looks good in online gear layouts.", comments: 19, likes: 36 },
  { id: "20", title: "Low-power ways to stay cool in summer outages", category: "General Preparedness", author: "blueember", excerpt: "Fans, shade, water, sleeping arrangements, and room setup can matter more than people realize.", comments: 11, likes: 23 },
  { id: "21", title: "Radio check routines for local groups", category: "Comms", author: "quietsignal", excerpt: "Has anyone settled on a simple weekly radio check pattern that does not burn people out?", comments: 10, likes: 19 },
  { id: "22", title: "How I staged blackout gear by zone", category: "Power Outages", author: "matt", excerpt: "Front closet, kitchen, vehicles, and bedroom closets all needed different gear instead of one giant bin.", comments: 9, likes: 18 },
  { id: "23", title: "Staples I always replace after winter", category: "Food Storage", author: "oakhollowhomestead", excerpt: "Cold weather burns through pantry items differently than summer, especially drinks, soups, and fuel.", comments: 7, likes: 15 },
  { id: "24", title: "Backup lighting that helps kids sleep", category: "Power Outages", author: "blueember", excerpt: "Warm low-glare lighting made a big difference for bedtime during the last outage at our house.", comments: 6, likes: 14 },
];

export const groups = [
  { name: "Power Outages", slug: "power-outages", description: "Share blackout updates, backup power setups, outage prep, and grid-down experience." },
  { name: "Off Grid Living", slug: "off-grid-living", description: "Discuss solar, water, cabins, batteries, generators, and living off-grid." },
  { name: "Food Storage", slug: "food-storage", description: "Long-term pantry planning, freeze-dried food, canning, and rotation systems." },
  { name: "Water & Filtration", slug: "water-filtration", description: "Storage, purification, wells, filters, and emergency water planning." },
  { name: "Medical / First Aid", slug: "medical-first-aid", description: "Preparedness-minded discussion around kits, supplies, and first aid readiness." },
  { name: "Comms", slug: "comms-group", description: "Ham radio, emergency communications, signal planning, and backup communication methods." },
  { name: "Homesteading", slug: "homesteading", description: "Gardens, livestock, self-reliance, preserving food, and homestead systems." },
  { name: "Security", slug: "security", description: "Home hardening, awareness, lighting, cameras, and practical safety planning." },
];

export const rightRailTopics = [
  "72-hour kits",
  "solar generators",
  "ham radio",
  "water storage",
  "medical kits",
];

export function getMemberProfile(username: string) {
  return memberProfiles.find((profile) => profile.username === username);
}
