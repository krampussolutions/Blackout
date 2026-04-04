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
    description: "Build a practical 72-hour kit with water, food, power, medical gear, documents, and season-specific supplies.",
    intro:
      "A 72-hour kit is your short-term cushion when normal routines break down. It helps you get through blackouts, storms, road closures, evacuations, and household emergencies without immediately scrambling for basics. The goal is not to build the perfect bag overnight. The goal is to cover the first three days with dependable essentials that are easy to carry, easy to find, and easy to maintain.",
    sections: [
      {
        heading: "Start with your household, not somebody else’s list",
        body: [
          "Before you buy gear, think through who the kit is actually for. A solo commuter kit looks different from a family kit kept at home, and both look different from a go-bag for evacuation.",
          "Count the people, pets, medications, and climate needs you actually have. A child in diapers, a diabetic adult, or a dog on daily medication changes the checklist fast.",
          "If possible, build one main household kit and then smaller grab-and-go kits for each vehicle or family member. That keeps the essentials centralized without leaving you exposed if you have to leave quickly.",
        ],
      },
      {
        heading: "Water is the first priority",
        body: [
          "Plan around one gallon of water per person per day for drinking and basic sanitation. For a full 72 hours, that means at least three gallons per person before you add extra for heat, illness, pets, or limited sanitation options.",
          "Stored water is better than relying only on filtration. Filters are important, but in the first hours of an outage or evacuation, ready-to-drink water is faster and more dependable.",
          "Use sturdy bottles or containers you can rotate on a schedule. If you have room, keep extra water separate from the bag so you can top off your short-term kit without overloading it.",
          "A small backup filter, purification tablets, or the ability to boil water gives you a second layer if the disruption lasts longer than expected.",
        ],
      },
      {
        heading: "Pack food that needs almost nothing from you",
        body: [
          "A 72-hour kit is not the place for complicated meals. Choose shelf-stable foods that can be eaten cold, require little prep, and hold up well during travel or power loss.",
          "Good starter options include protein bars, peanut butter, crackers, canned meat, tuna, soup, trail mix, instant oatmeal, electrolyte packets, dried fruit, and ready-to-eat meals that only need hot water if available.",
          "Keep a manual can opener in the kit if any food depends on it. Do not assume you will remember where the kitchen opener is when the lights are out or you need to leave quickly.",
          "Focus on calories, protein, and convenience first. Comfort foods matter too, especially for children, but the bag should solve hunger before it solves morale.",
        ],
      },
      {
        heading: "Lighting and backup power make everything easier",
        body: [
          "A headlamp is usually one of the highest-value items in the whole kit because it keeps both hands free. Pair it with a small flashlight and at least one backup battery set or charging cable.",
          "A compact lantern helps a room feel calmer than a flashlight beam bouncing around the walls. That matters more than people think during long evenings without power.",
          "Add at least one charged power bank and the cords your household actually uses. Label or bundle the cables so you are not sorting through random chargers when phones are low.",
          "If you rely on rechargeable gear, keep a backup option that does not depend on wall power being restored quickly. A dead power bank is just extra weight.",
        ],
      },
      {
        heading: "Cover first aid, hygiene, and daily meds",
        body: [
          "Your kit should handle common injuries, minor illness, and personal care without needing a drugstore run. Stock bandages, gauze, tape, antiseptic wipes, gloves, pain relievers, antihistamines, tweezers, and any personal prescriptions you can legally and safely rotate.",
          "Do not forget hygiene basics. Toothbrushes, toothpaste, wipes, soap, toilet paper, feminine products, diapers, and trash bags are easy to overlook and miserable to do without.",
          "If someone in the home needs glasses, hearing aid batteries, inhalers, insulin supplies, mobility aids, or backup medical paperwork, those items belong on the checklist before you add more gear gadgets.",
          "Check expiration dates and refill cycles regularly. Medical readiness fails quietly when people assume a kit packed a year ago is still ready today.",
        ],
      },
      {
        heading: "Documents, cash, and communication backups matter",
        body: [
          "Keep a small waterproof pouch with copies of identification, insurance information, emergency contacts, local maps, and any key medical information you would need if your phone died or service went down.",
          "A little cash in small bills is worth carrying. Card readers, ATMs, and gas pumps do not always work smoothly during outages or evacuations.",
          "Write down at least one out-of-area contact and one local meeting point. People often assume they will remember numbers and plans under stress, but that confidence disappears fast when batteries are low and routines are broken.",
          "A battery radio or crank radio can also belong in the kit if severe weather, wildfire, or infrastructure outages are common in your area.",
        ],
      },
      {
        heading: "Clothing, shelter, and season-specific supplies",
        body: [
          "Add a weather layer for each person, even if the bag stays in the house. A hoodie, socks, gloves, poncho, emergency blanket, or rain shell can solve a lot of discomfort fast.",
          "Your local climate should shape the kit. Cold-weather kits need insulation, hand warmers, hats, and ways to stay dry. Hot-weather kits need extra water, electrolyte support, sun protection, and cooling considerations.",
          "If evacuation is a possibility, include sturdy shoes or at least keep them staged next to the kit. Walking out in slides or barefoot because the kit was packed but the footwear was forgotten is a common oversight.",
          "For vehicle kits, assume you may be stranded for hours before help arrives. That makes blankets, visibility gear, and weather protection more important than they look on paper.",
        ],
      },
      {
        heading: "Do not forget kids, pets, and comfort items",
        body: [
          "Children burn through patience and supplies faster than adults during disruption. Pack diapers, wipes, formula, snacks, comfort items, small activities, and any age-specific medicines they may need.",
          "Pets need food, water, leash or carrier gear, waste bags, and medication too. A household kit that ignores the animals is incomplete.",
          "A few morale items can make a rough situation more manageable. Think deck of cards, not entertainment center. Simple comfort goes a long way when power is out and routines are disrupted.",
        ],
      },
      {
        heading: "Store it well and review it on a schedule",
        body: [
          "A great checklist does not help if the bag is buried behind holiday decorations or packed so heavily nobody wants to move it. Use durable containers, label them clearly, and keep them where you can reach them fast.",
          "Review the kit at least twice a year. Rotate food, water, batteries, clothing sizes, medications, and seasonal gear. Tie the review to daylight saving time, storm season, or another date you already remember.",
          "Preparedness works best when the kit is simple enough to maintain. A realistic kit that gets checked is far better than an elaborate setup that is forgotten.",
        ],
      },
      {
        heading: "Simple 72-hour kit starter checklist",
        body: [
          "For each person: water, easy food, one light source, weather layer, medications, hygiene basics, phone charging cable, and copies of important contacts.",
          "For the household: first aid kit, can opener, power bank, radio, trash bags, cash, lighter or matches where appropriate, and a written plan for communication and meeting up.",
          "For special needs: pet supplies, diapers, mobility or medical equipment, and climate-specific gear. The most important checklist is the one that matches your real life.",
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
