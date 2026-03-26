export type GuideEntry = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; body: string[] }>;
};

export const guides: GuideEntry[] = [
  {
    slug: "72-hour-kit-checklist",
    title: "72-Hour Kit Checklist for Blackouts and Emergencies",
    description: "Build a practical 72-hour kit with water, lighting, food, power, and medical basics.",
    intro:
      "A 72-hour kit gives you a fast, dependable starting point for outages, storms, evacuations, and household disruptions. Keep it simple, practical, and easy to grab.",
    sections: [
      {
        heading: "Water first",
        body: [
          "Plan around one gallon of water per person per day for drinking and basic sanitation.",
          "Store more than the minimum if you have children, pets, or medical needs.",
        ],
      },
      {
        heading: "Light and power",
        body: [
          "Pack headlamps, flashlights, spare batteries, and at least one rechargeable power bank.",
          "A small lantern is usually better than relying on one flashlight for everything.",
        ],
      },
      {
        heading: "Food and medical basics",
        body: [
          "Keep shelf-stable meals, snacks, a manual can opener, prescriptions, first aid supplies, and hygiene items together.",
          "Rotate food and medications on a schedule so your kit stays ready.",
        ],
      },
    ],
  },
  {
    slug: "how-to-store-water",
    title: "How to Store Water for Home Preparedness",
    description: "A simple guide to containers, treatment, rotation, and backup water planning at home.",
    intro:
      "Water planning is one of the fastest ways to improve household resilience. Good storage beats complicated gear when the tap stops working.",
    sections: [
      {
        heading: "Choose reliable containers",
        body: [
          "Use food-safe containers made for long-term storage whenever possible.",
          "Label everything with the fill date and keep storage out of direct sunlight when you can.",
        ],
      },
      {
        heading: "Treat and rotate",
        body: [
          "If you are using tap water, follow your local guidance on sanitizing containers and safe rotation intervals.",
          "A rotation reminder on your calendar keeps the process simple.",
        ],
      },
      {
        heading: "Have a backup purification plan",
        body: [
          "Stored water is your first layer. Filters, purification tablets, and boiling are your backup layers.",
          "Do not rely on one filter or one container size for every scenario.",
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
