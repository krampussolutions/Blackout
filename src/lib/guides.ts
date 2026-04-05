export type GuideSection = {
  id?: string;
  heading: string;
  summary?: string;
  body: string[];
  bullets?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export type GuideEntry = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  readTime?: string;
  publishedLabel?: string;
  updatedLabel?: string;
  coverImageSrc?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  quickChecklist?: string[];
  sections: GuideSection[];
};

export const guides: GuideEntry[] = [
  {
    slug: "72-hour-kit-checklist",
    title: "72-Hour Kit Checklist for Blackouts and Emergencies",
    description: "Build a practical 72-hour kit with water, lighting, food, power, and medical basics.",
    intro:
      "A 72-hour kit is your short-term cushion when normal routines break down. It helps you get through blackouts, storms, road closures, evacuations, and household emergencies without immediately scrambling for basics.",
    readTime: "10 min read",
    publishedLabel: "Published January 2025",
    updatedLabel: "Updated April 2026",
    coverImageSrc: "/guides/72-hour-kit/hero-kit.svg",
    coverImageAlt: "Illustration of a packed emergency bag with water, food, lighting, and first aid supplies.",
    coverImageCaption:
      "Start with the basics you can grab fast: water, food, light, first aid, power, and comfort items.",
    quickChecklist: [
      "Store at least 3 gallons of water per person for the first 72 hours.",
      "Pack simple shelf-stable food, a can opener, and utensils.",
      "Stage lighting, batteries, a power bank, and a radio in one place.",
      "Add first aid, prescriptions, hygiene items, and daily-use basics.",
      "Include shoes, clothes, copies of documents, cash, and family-specific extras.",
    ],
    sections: [
      {
        heading: "Water and food",
        summary: "Start with the items your household needs first when utilities or stores are unavailable.",
        body: [
          "Water matters more than almost anything else in the first phase of an emergency. Three days goes fast, especially if you are drinking, cooking, and doing minimal cleanup out of the same supply.",
          "Food should be easy to open, easy to portion, and easy to eat under stress. A 72-hour kit is not the place for complicated cooking plans or bulky pantry storage.",
        ],
        bullets: [
          "At least 1 gallon of water per person per day, with extra for pets and medical needs.",
          "Shelf-stable meals, canned food, protein bars, instant oatmeal, rice pouches, and snacks.",
          "Manual can opener, utensils, paper towels, and a few trash bags.",
        ],
        imageSrc: "/guides/72-hour-kit/water-food.svg",
        imageAlt: "Emergency water, food, and basic meal supplies arranged on a dark background.",
        imageCaption: "Keep food simple and water easy to reach.",
      },
      {
        heading: "Tools, light, power, and medical",
        summary: "This is the layer that makes the first night easier and the first problem less stressful.",
        body: [
          "A dark house feels chaotic fast. Good lighting, spare batteries, and a small backup radio help you stay organized and reduce stress during a blackout or evacuation.",
          "Medical and hygiene items should cover the basics you know your household uses. Your kit does not need to replace a full medicine cabinet, but it should solve the first obvious problems.",
        ],
        bullets: [
          "Headlamp or flashlight, lantern, spare batteries, and at least one power bank.",
          "Weather radio, multi-tool, duct tape, gloves, and charging cables.",
          "First aid kit, prescriptions, pain relievers, sanitizer, wipes, and toilet paper.",
        ],
        imageSrc: "/guides/72-hour-kit/light-medical.svg",
        imageAlt: "Lighting, radio, first aid, and backup power gear for a 72-hour emergency kit.",
        imageCaption: "Hands-free light and medical basics solve a lot of early outage problems.",
      },
      {
        heading: "Family, comfort, and seasonal extras",
        summary: "Households with kids, pets, or weather risks need more than the bare minimum list.",
        body: [
          "A kit works better when it reflects your actual household. Diapers, formula, pet food, spare glasses, hearing aid batteries, and comfort items are not extras if you depend on them.",
          "Seasonal additions matter too. Cold weather may mean blankets, gloves, and hand warmers. Hot climates may mean cooling towels, sunscreen, and more water.",
        ],
        bullets: [
          "Clothes, sturdy shoes, blanket, poncho, and compact shelter layers.",
          "Diapers, wipes, formula, baby supplies, and comfort items for children.",
          "Pet food, water bowl, leash, waste bags, and copies of key documents and IDs.",
        ],
        imageSrc: "/guides/72-hour-kit/family-seasonal.svg",
        imageAlt: "Blankets, baby supplies, and pet gear laid out for a household emergency kit.",
        imageCaption: "The right extras depend on who lives in your house and what season you are planning for.",
      },
    ],
  },
  {
    slug: "how-to-store-water",
    title: "How to Store Water for Home Preparedness",
    description: "A practical guide to home water storage, treatment, rotation, and backup purification planning.",
    intro:
      "Water storage is one of the fastest ways to make your household more resilient. When the tap is off, contaminated, or unreliable, stored water buys you time, lowers stress, and keeps simple problems from turning into major ones.",
    readTime: "9 min read",
    publishedLabel: "Published January 2025",
    updatedLabel: "Updated April 2026",
    coverImageSrc: "/guides/how-to-store-water/hero-water.svg",
    coverImageAlt: "Illustration of water storage jugs, stackable containers, and small purification supplies.",
    coverImageCaption:
      "Reliable storage comes first. Filters, tablets, and treatment are your second layer, not your only plan.",
    quickChecklist: [
      "Store at least 1 gallon of water per person per day for a minimum of 3 days.",
      "Use food-safe containers and keep them out of heat, sunlight, and chemicals.",
      "Label containers with the fill date and your treatment or rotation notes.",
      "Keep a second layer ready: filter, purification tablets, or unscented bleach used correctly.",
      "Build storage in more than one size so you can move, refill, and ration more easily.",
    ],
    sections: [
      {
        heading: "Start with how much water your household really needs",
        summary: "Good storage starts with demand, not shopping.",
        body: [
          "A simple baseline is one gallon per person per day for drinking and basic sanitation. That minimum works as a starting point, but many households need more because of heat, pets, cooking, medical needs, or cleaning after a storm.",
          "Think in layers. The first layer is the amount you want inside the house right now. The second layer is what you can safely refill, filter, or transport if service stays down longer than expected.",
        ],
        bullets: [
          "3 days is a starting point, not a limit.",
          "Plan extra for children, nursing parents, elderly family members, and pets.",
          "Hot climates and outage cleanup usually increase water use fast.",
        ],
        imageSrc: "/guides/how-to-store-water/containers.svg",
        imageAlt: "Different home water storage containers including jugs, stackable bins, and bottles.",
        imageCaption: "A mix of container sizes makes storage easier to move, use, and rotate.",
      },
      {
        heading: "Choose containers you trust and can manage",
        summary: "The best container is the one that is food-safe, sealed well, and practical for your space.",
        body: [
          "Food-grade jugs, purpose-built stackable containers, and commercially sealed water are the simplest choices for most homes. Avoid containers that once held chemicals or anything that can leave residue or odor behind.",
          "Do not store everything in one giant container if nobody in the house can lift it safely. Smaller containers are often easier to rotate and more useful if you need to move water room to room or load it in a vehicle.",
        ],
        bullets: [
          "Use food-safe storage only.",
          "Favor container sizes you can actually lift and pour.",
          "Store water away from direct sun, fuel, paint, and household chemicals.",
        ],
        imageSrc: "/guides/how-to-store-water/storage-space.svg",
        imageAlt: "Water jugs and stacked storage containers stored neatly in a cool closet or utility room.",
        imageCaption: "Cool, dark storage protects water quality and makes rotation easier.",
      },
      {
        heading: "Treat, label, and rotate without overcomplicating it",
        summary: "The goal is a repeatable routine, not a perfect spreadsheet.",
        body: [
          "If you are filling containers yourself, sanitize them first and follow dependable guidance for safe filling and treatment. Label each container with the date so you know what is oldest and what should be used first.",
          "A calendar reminder is usually enough. Many households avoid water storage because they imagine a complicated maintenance plan, but a simple review every few months keeps the job manageable.",
        ],
        bullets: [
          "Write the fill date clearly on each container.",
          "Use the oldest water first for cleaning, watering plants, or routine backup use.",
          "Check seals, odors, and storage conditions during every review.",
        ],
        imageSrc: "/guides/how-to-store-water/treatment.svg",
        imageAlt: "Sanitizing supplies, labels, and rotation reminders for stored water containers.",
        imageCaption: "A date label and a simple reminder system do most of the work.",
      },
      {
        heading: "Keep backup purification ready for longer problems",
        summary: "Stored water gets you through the opening phase. Purification keeps options open after that.",
        body: [
          "A filter, purification tablets, or another safe treatment method gives you options if the outage lasts longer or you need to refill from an uncertain source. Do not wait to figure this out after a main break, boil advisory, or storm contamination event.",
          "Backup purification is most useful when paired with storage containers, not treated as a substitute for them. The best setup is stored water first, purification second, and a realistic idea of where replacement water would come from if the issue stretches out.",
        ],
        bullets: [
          "Keep at least one tested purification method at home.",
          "Store collapsible containers or spare jugs for emergency refill runs.",
          "Write down safe refill sources and boil or treatment instructions before you need them.",
        ],
        imageSrc: "/guides/how-to-store-water/purification.svg",
        imageAlt: "Portable water filter, purification tablets, and refill containers for emergency backup use.",
        imageCaption: "Stored water is your first layer. Purification is the backup plan that keeps you flexible.",
      },
      {
        heading: "Build a water plan that fits your home",
        summary: "The best water setup is the one your household will actually maintain.",
        body: [
          "Apartment storage, large-family storage, storm-prone storage, and rural well-water storage all look different. The key is to start with a clear baseline, add storage that fits your space, and practice using it before an emergency forces the issue.",
          "Even a modest water reserve changes how an outage feels. It gives you time to think, time to make better decisions, and time to solve the next problem without panic.",
        ],
        bullets: [
          "Choose one primary storage spot and one overflow option.",
          "Keep a small grab-and-go water layer if evacuation is possible in your area.",
          "Review the plan every season and after any outage that exposes a weak point.",
        ],
      },
    ],
  },
  {
    slug: "beginner-blackout-prep",
    title: "Beginner Blackout Prep: Start Here",
    description: "A no-nonsense starting guide for families preparing for their first serious outage.",
    intro:
      "You do not need a bunker to prepare for a blackout. Most households get the biggest wins from a handful of practical upgrades and a written plan.",
    sections: [
      {
        heading: "Cover the first 24 hours",
        body: [
          "Think through lighting, phone charging, food, water, warmth or cooling, and basic communication.",
          "Write down what your household needs first before buying more gear.",
        ],
      },
      {
        heading: "Know your weak points",
        body: [
          "If your biggest risk is winter ice, plan differently than if your biggest risk is summer storms or hurricanes.",
          "Preparedness is stronger when it matches your region and home setup.",
        ],
      },
      {
        heading: "Practice once",
        body: [
          "Try an evening without grid power by choice. You will learn more from one test run than from hours of shopping.",
          "Use that test to improve your storage, charging plan, and comfort items.",
        ],
      },
    ],
  },
  {
    slug: "home-backup-lighting",
    title: "Home Backup Lighting That Actually Works",
    description: "A practical approach to blackout lighting using headlamps, lanterns, room lights, and battery rotation.",
    intro:
      "Bad lighting turns small outages into frustrating ones. Good lighting makes the home calmer, safer, and easier to manage.",
    sections: [
      {
        heading: "Layer your lighting",
        body: [
          "Use headlamps for hands-free work, small flashlights for quick checks, and lanterns for shared living spaces.",
          "Keep one light source in every major room instead of centralizing everything.",
        ],
      },
      {
        heading: "Standardize batteries",
        body: [
          "Too many battery types complicate outages. Choose a small number of common sizes and keep a rotation system.",
          "Rechargeable setups are useful, but have a backup plan if charging is limited.",
        ],
      },
      {
        heading: "Think about comfort",
        body: [
          "Warm, even room light reduces stress during long outages more than a bright tactical flashlight does.",
          "Lighting is not just about visibility; it affects morale and routine.",
        ],
      },
    ],
  },
  {
    slug: "family-emergency-comms-plan",
    title: "Family Emergency Communications Plan",
    description: "Build a family communications plan for outages, storms, and disruptions when normal routines break down.",
    intro:
      "A communications plan is one of the most overlooked pieces of preparedness. It does not need to be complicated to be effective.",
    sections: [
      {
        heading: "Write down key contacts",
        body: [
          "Keep a paper copy of important phone numbers, addresses, and an out-of-area contact.",
          "Do not assume everyone will have battery power or cell service when needed.",
        ],
      },
      {
        heading: "Set check-in rules",
        body: [
          "Decide when, how, and where family members should check in during an outage or disruption.",
          "A simple meeting point or message routine reduces confusion fast.",
        ],
      },
      {
        heading: "Add backup options",
        body: [
          "Battery banks, car chargers, radios, and agreed-upon fallback plans make your communications more resilient.",
          "Preparedness works best when every household member understands the plan ahead of time.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
