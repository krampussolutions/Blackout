export type GuideImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type GuideSection = {
  heading: string;
  navLabel?: string;
  body: string[];
  bullets?: string[];
  image?: GuideImage;
};

export type GuideChecklistGroup = {
  title: string;
  items: string[];
};

export type GuideEntry = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  coverImage?: GuideImage;
  quickChecklist?: GuideChecklistGroup[];
  sections: GuideSection[];
};

export const guides: GuideEntry[] = [
  {
    slug: "72-hour-kit-checklist",
    title: "72-Hour Kit Checklist for Blackouts and Emergencies",
    description: "Build a practical 72-hour kit with water, food, power, medical gear, documents, and season-specific supplies.",
    intro:
      "A 72-hour kit is your short-term cushion when normal routines break down. It helps you get through blackouts, storms, road closures, evacuations, and household emergencies without immediately scrambling for basics. The goal is not to build the perfect bag overnight. The goal is to cover the first three days with dependable essentials that are easy to carry, easy to find, and easy to maintain.",
    coverImage: {
      src: "/guides/72-hour-kit/hero-kit.svg",
      alt: "Illustration of a staged 72-hour emergency kit with water, food, lighting, first-aid, and documents.",
      caption: "A good 72-hour kit covers the basics first: water, food, light, first aid, documents, clothing, and practical extras.",
    },
    quickChecklist: [
      {
        title: "Pack first",
        items: [
          "Three days of water per person, plus pet water if needed",
          "Shelf-stable food that can be eaten cold or with minimal prep",
          "Headlamp or flashlight, batteries, and a charged power bank",
          "Basic first-aid, hygiene items, and daily medications",
        ],
      },
      {
        title: "Do not forget",
        items: [
          "Manual can opener, utensils, lighter or matches if safe",
          "Copies of IDs, emergency contacts, insurance, and small cash",
          "Seasonal clothing, sturdy shoes, blankets, and rain gear",
          "Kid supplies, pet gear, and one or two morale items",
        ],
      },
      {
        title: "Review on a schedule",
        items: [
          "Rotate food, water, batteries, and medications twice a year",
          "Update clothing sizes, diapers, and pet food as needs change",
          "Check cords, chargers, radios, and lighting before storm season",
          "Keep the kit where you can grab it quickly, not buried in storage",
        ],
      },
    ],
    sections: [
      {
        heading: "Start with your household, not somebody else’s list",
        navLabel: "Start with your household",
        bullets: [
          "Count every person, pet, medication, and mobility need first",
          "Build for your real risks: blackout, storm, wildfire, evacuation, or travel delay",
          "Use one main household kit and smaller vehicle or grab-and-go kits if possible",
        ],
        body: [
          "Before you buy gear, think through who the kit is actually for. A solo commuter kit looks different from a family kit kept at home, and both look different from a go-bag for evacuation.",
          "Count the people, pets, medications, and climate needs you actually have. A child in diapers, a diabetic adult, or a dog on daily medication changes the checklist fast.",
          "If possible, build one main household kit and then smaller grab-and-go kits for each vehicle or family member. That keeps the essentials centralized without leaving you exposed if you have to leave quickly.",
        ],
      },
      {
        heading: "Water is the first priority",
        navLabel: "Water first",
        image: {
          src: "/guides/72-hour-kit/water-food.svg",
          alt: "Illustration showing water containers, canned food, and compact ready-to-eat supplies for a 72-hour kit.",
          caption: "Stored water and low-prep food should be the first things staged, not the last things improvised.",
        },
        bullets: [
          "Plan for at least 1 gallon per person per day for 3 days",
          "Store extra water for heat, illness, pets, and limited sanitation",
          "Keep a backup option like purification tablets, a filter, or boiling capability",
        ],
        body: [
          "Plan around one gallon of water per person per day for drinking and basic sanitation. For a full 72 hours, that means at least three gallons per person before you add extra for heat, illness, pets, or limited sanitation options.",
          "Stored water is better than relying only on filtration. Filters are important, but in the first hours of an outage or evacuation, ready-to-drink water is faster and more dependable.",
          "Use sturdy bottles or containers you can rotate on a schedule. If you have room, keep extra water separate from the bag so you can top off your short-term kit without overloading it.",
          "A small backup filter, purification tablets, or the ability to boil water gives you a second layer if the disruption lasts longer than expected.",
        ],
      },
      {
        heading: "Pack food that needs almost nothing from you",
        navLabel: "Low-prep food",
        bullets: [
          "Choose food that survives rough handling, temperature swings, and no microwave",
          "Favor calories, protein, and convenience before comfort extras",
          "Pack the can opener, spoon, and napkins with the food, not somewhere else",
        ],
        body: [
          "A 72-hour kit is not the place for complicated meals. Choose shelf-stable foods that can be eaten cold, require little prep, and hold up well during travel or power loss.",
          "Good starter options include protein bars, peanut butter, crackers, canned meat, tuna, soup, trail mix, instant oatmeal, electrolyte packets, dried fruit, and ready-to-eat meals that only need hot water if available.",
          "Keep a manual can opener in the kit if any food depends on it. Do not assume you will remember where the kitchen opener is when the lights are out or you need to leave quickly.",
          "Focus on calories, protein, and convenience first. Comfort foods matter too, especially for children, but the bag should solve hunger before it solves morale.",
        ],
      },
      {
        heading: "Lighting and backup power make everything easier",
        navLabel: "Light and power",
        image: {
          src: "/guides/72-hour-kit/light-medical.svg",
          alt: "Illustration of a lantern, flashlight, power bank, and first-aid pouch laid out for emergency use.",
          caption: "Hands-free light, charging options, and basic medical gear reduce stress fast during outages and evacuations.",
        },
        bullets: [
          "Lead with a headlamp, then add a flashlight and room light",
          "Store spare batteries or charging cables with the device they belong to",
          "Keep at least one charged power bank ready instead of still in the box",
        ],
        body: [
          "A headlamp is usually one of the highest-value items in the whole kit because it keeps both hands free. Pair it with a small flashlight and at least one backup battery set or charging cable.",
          "A compact lantern helps a room feel calmer than a flashlight beam bouncing around the walls. That matters more than people think during long evenings without power.",
          "Add at least one charged power bank and the cords your household actually uses. Label or bundle the cables so you are not sorting through random chargers when phones are low.",
          "If you rely on rechargeable gear, keep a backup option that does not depend on wall power being restored quickly. A dead power bank is just extra weight.",
        ],
      },
      {
        heading: "Cover first aid, hygiene, and daily meds",
        navLabel: "Medical and hygiene",
        bullets: [
          "Stock bandages, gauze, tape, antiseptic, gloves, tweezers, and pain relief",
          "Add hygiene basics: wipes, toilet paper, soap, feminine products, diapers, and trash bags",
          "Rotate prescriptions, inhalers, backup glasses, and other personal medical needs",
        ],
        body: [
          "Your kit should handle common injuries, minor illness, and personal care without needing a drugstore run. Stock bandages, gauze, tape, antiseptic wipes, gloves, pain relievers, antihistamines, tweezers, and any personal prescriptions you can legally and safely rotate.",
          "Do not forget hygiene basics. Toothbrushes, toothpaste, wipes, soap, toilet paper, feminine products, diapers, and trash bags are easy to overlook and miserable to do without.",
          "If someone in the home needs glasses, hearing aid batteries, inhalers, insulin supplies, mobility aids, or backup medical paperwork, those items belong on the checklist before you add more gear gadgets.",
          "Check expiration dates and refill cycles regularly. Medical readiness fails quietly when people assume a kit packed a year ago is still ready today.",
        ],
      },
      {
        heading: "Documents, cash, and communication backups matter",
        navLabel: "Docs, cash, and comms",
        bullets: [
          "Use a waterproof pouch for copies of IDs, insurance, contacts, and medical info",
          "Keep small bills for fuel, food, and purchases when readers or ATMs fail",
          "Write down one out-of-area contact and one meeting point for the household",
        ],
        body: [
          "Keep a small waterproof pouch with copies of identification, insurance information, emergency contacts, local maps, and any key medical information you would need if your phone died or service went down.",
          "A little cash in small bills is worth carrying. Card readers, ATMs, and gas pumps do not always work smoothly during outages or evacuations.",
          "Write down at least one out-of-area contact and one local meeting point. People often assume they will remember numbers and plans under stress, but that confidence disappears fast when batteries are low and routines are broken.",
          "A battery radio or crank radio can also belong in the kit if severe weather, wildfire, or infrastructure outages are common in your area.",
        ],
      },
      {
        heading: "Clothing, shelter, and season-specific supplies",
        navLabel: "Clothing and seasonal gear",
        bullets: [
          "Pack at least one weather layer, socks, and rain protection for each person",
          "Adjust for your region: insulation in cold, extra hydration and sun protection in heat",
          "Stage real shoes or boots next to the kit if evacuation is a possibility",
        ],
        body: [
          "Add a weather layer for each person, even if the bag stays in the house. A hoodie, socks, gloves, poncho, emergency blanket, or rain shell can solve a lot of discomfort fast.",
          "Your local climate should shape the kit. Cold-weather kits need insulation, hand warmers, hats, and ways to stay dry. Hot-weather kits need extra water, electrolyte support, sun protection, and cooling considerations.",
          "If evacuation is a possibility, include sturdy shoes or at least keep them staged next to the kit. Walking out in slides or barefoot because the kit was packed but the footwear was forgotten is a common oversight.",
          "For vehicle kits, assume you may be stranded for hours before help arrives. That makes blankets, visibility gear, and weather protection more important than they look on paper.",
        ],
      },
      {
        heading: "Do not forget kids, pets, and comfort items",
        navLabel: "Kids, pets, and comfort",
        image: {
          src: "/guides/72-hour-kit/family-seasonal.svg",
          alt: "Illustration representing family members, pets, and seasonal gear included in a household emergency kit.",
          caption: "Preparedness works better when the kit matches the people, pets, and weather realities you actually live with.",
        },
        bullets: [
          "Pack diapers, wipes, formula, small snacks, and simple comfort items for children",
          "Add pet food, bowls, leash or carrier gear, waste bags, and medications",
          "One small morale item per person helps more than people expect during a rough night",
        ],
        body: [
          "Children burn through patience and supplies faster than adults during disruption. Pack diapers, wipes, formula, snacks, comfort items, small activities, and any age-specific medicines they may need.",
          "Pets need food, water, leash or carrier gear, waste bags, and medication too. A household kit that ignores the animals is incomplete.",
          "A few morale items can make a rough situation more manageable. Think deck of cards, not entertainment center. Simple comfort goes a long way when power is out and routines are disrupted.",
        ],
      },
      {
        heading: "Store it well and review it on a schedule",
        navLabel: "Store and review",
        bullets: [
          "Keep the kit in a labeled spot you can reach in the dark or in a hurry",
          "Review twice a year and tie it to a date you already remember",
          "Replace expired food, dead batteries, old meds, and outgrown clothing",
        ],
        body: [
          "A great checklist does not help if the bag is buried behind holiday decorations or packed so heavily nobody wants to move it. Use durable containers, label them clearly, and keep them where you can reach them fast.",
          "Review the kit at least twice a year. Rotate food, water, batteries, clothing sizes, medications, and seasonal gear. Tie the review to daylight saving time, storm season, or another date you already remember.",
          "Preparedness works best when the kit is simple enough to maintain. A realistic kit that gets checked is far better than an elaborate setup that is forgotten.",
        ],
      },
      {
        heading: "Simple 72-hour kit starter checklist",
        navLabel: "Starter checklist",
        bullets: [
          "Water: three gallons per person, bottles, and a backup purification option",
          "Food: shelf-stable meals, snacks, can opener, and utensils",
          "Light and power: headlamp, flashlight, batteries, radio, power bank, charging cords",
          "Medical and hygiene: first-aid kit, prescriptions, wipes, soap, toilet paper, gloves",
          "Documents and cash: IDs, contacts, insurance copies, maps, and small bills",
          "Clothing and extras: socks, layers, blanket, rain gear, shoes, pet gear, kid items",
        ],
        body: [
          "For each person, start with water, food, light, first aid, basic hygiene, medications, charging, clothing layers, and a copy of emergency information. Then add needs that are specific to your household such as infant supplies, pet gear, mobility or medical equipment, and climate-specific gear. The most important checklist is the one that matches your real life.",
        ],
      },
    ],
  },
  {
    slug: "how-to-store-water",
    title: "How to Store Water for Home Preparedness",
    description: "Learn how much water to store, which containers to use, where to keep them, how to rotate safely, and which backup purification layers matter most.",
    intro:
      "Water storage is one of the simplest preparedness upgrades you can make because it solves a problem before you are thirsty, stressed, or standing in line somewhere else. A good home water plan is not complicated. It is a mix of realistic household math, reliable containers, safe storage spots, rotation habits, and one or two backup purification options in case the disruption lasts longer than expected.",
    coverImage: {
      src: "/guides/how-to-store-water/hero-water.svg",
      alt: "Illustration of home water storage containers, jugs, bottles, and purification supplies staged on shelves.",
      caption: "Stored water should be easy to reach, easy to rotate, and sized for the way your household actually uses it.",
    },
    quickChecklist: [
      {
        title: "Store first",
        items: [
          "Aim for at least 1 gallon per person per day for a 3-day disruption",
          "Add extra for pets, heat, cooking, and limited sanitation needs",
          "Use food-safe bottles, jugs, or stackable containers you can move safely",
          "Keep some ready-to-drink water where you can reach it fast",
        ],
      },
      {
        title: "Do it right",
        items: [
          "Label containers with the fill date and water source",
          "Store water in cool, dark, indoor spaces away from chemicals and sunlight",
          "Rotate on a simple schedule you will actually follow",
          "Check lids, seals, and container condition during every review",
        ],
      },
      {
        title: "Back it up",
        items: [
          "Keep unscented bleach or another approved treatment option if appropriate",
          "Add a filter, purification tablets, or boiling capability as a second layer",
          "Know where nearby backup water sources are before you need them",
          "Write down your household water plan instead of trusting memory",
        ],
      },
    ],
    sections: [
      {
        heading: "Start with real household math",
        navLabel: "Count your need",
        bullets: [
          "Use 1 gallon per person per day as your baseline for short disruptions",
          "Add extra for pets, cooking, hot weather, illness, and sanitation",
          "Plan separately for home storage, vehicle water, and grab-and-go needs",
        ],
        body: [
          "The most common water-prep mistake is storing an amount that sounds good instead of an amount that matches the household. Start with one gallon per person per day for at least three days, then adjust upward if you have pets, high heat, medical needs, or expect to rely on stored water for more than drinking.",
          "That baseline disappears quickly in real life. People use water for medicine, brushing teeth, quick cleanup, washing hands, mixing food, and keeping kids or pets comfortable. A family of four can burn through a small stash fast if the outage or disruption stretches into a weekend.",
          "Think in layers. Keep some water that is easy to grab immediately, some that is staged deeper for longer disruptions, and a separate plan for vehicles or evacuation if that is part of your risk picture.",
        ],
      },
      {
        heading: "Choose containers that fit your space and strength",
        navLabel: "Choose containers",
        image: {
          src: "/guides/how-to-store-water/containers.svg",
          alt: "Illustration of different home water storage options including bottles, stackable jugs, and larger handled containers.",
          caption: "The best container is the one you can fill, carry, store, and rotate without making the job harder than it needs to be.",
        },
        bullets: [
          "Use food-safe containers designed for water whenever possible",
          "Mix smaller grab-ready containers with a few larger high-volume ones",
          "Avoid cracked, sun-damaged, or mystery containers that were not meant for drinking water",
        ],
        body: [
          "Container choice matters because good storage is only useful if the water stays safe and the container is practical to handle. Small commercial bottles are easy to rotate and move. Mid-size jugs are good for household access. Larger stackable containers give you better volume per square foot but become heavy fast.",
          "Choose a mix that matches your home and your body. A large container that nobody in the house can comfortably lift is harder to use than several smaller ones that can be moved without spilling or injury.",
          "Food-safe, purpose-made water containers are the safest default. If you reuse containers, make sure they are clean, undamaged, and suitable for drinking water. Skip anything that held chemicals or anything that is already degrading.",
        ],
      },
      {
        heading: "Pick storage spots that stay cool, dark, and clean",
        navLabel: "Pick storage spots",
        image: {
          src: "/guides/how-to-store-water/storage-space.svg",
          alt: "Illustration of indoor shelves with water containers stored off the floor and away from windows and chemical products.",
          caption: "Heat, sunlight, and contamination risk matter just as much as how much water you own.",
        },
        bullets: [
          "Store water indoors when possible and keep it out of direct sunlight",
          "Do not park drinking water next to fuel, paint, pesticides, or strong cleaners",
          "Spread storage across a few locations so one leak or access problem does not wipe out everything",
        ],
        body: [
          "Good storage spots protect the water and make the system easier to live with. Cool, dark, indoor spaces are usually best because they reduce heat stress on containers and help preserve water quality over time.",
          "Avoid storing drinking water beside gasoline, solvents, paint, pesticides, or other harsh chemicals. Even sealed containers should not live in places where spills, fumes, or repeated heat swings are likely.",
          "If you have the room, divide your supply into more than one location. A little in the pantry, a little in a utility closet, and a little in another protected space is better than one giant stash that becomes inaccessible because of clutter, a leak, or one damaged shelf.",
        ],
      },
      {
        heading: "Fill, label, treat, and rotate on a real schedule",
        navLabel: "Fill and rotate",
        image: {
          src: "/guides/how-to-store-water/treatment.svg",
          alt: "Illustration of labeled water containers, date tags, cleaning supplies, and a simple household calendar reminder.",
          caption: "The safest water system is the one you label clearly and check on a schedule simple enough to survive real life.",
        },
        bullets: [
          "Label every container with the fill date and source",
          "Clean containers before use and follow local guidance for tap-water storage",
          "Tie rotation to an easy trigger like daylight savings, storm season, or a recurring calendar alert",
        ],
        body: [
          "Stored water fails quietly when nobody remembers what was filled when. A label with the fill date, source, and any treatment note makes the whole system easier to trust and easier to maintain.",
          "If you are using municipal tap water, your local guidance may already treat it as safe for storage in clean containers. If you are filling from another source, sanitize containers carefully and follow trusted treatment instructions instead of guessing.",
          "The key is not building the perfect spreadsheet. The key is having a rotation rhythm that actually happens. A calendar reminder every six months, tied to a seasonal routine, is usually better than an elaborate system that gets ignored.",
        ],
      },
      {
        heading: "Add backup purification before you need it",
        navLabel: "Backup purification",
        image: {
          src: "/guides/how-to-store-water/purification.svg",
          alt: "Illustration of a water filter, purification tablets, a metal pot, and emergency water gear for secondary treatment.",
          caption: "Stored water is your first layer. Filtration, treatment, and boiling are the backup layers that carry you farther.",
        },
        bullets: [
          "Keep at least one secondary way to make questionable water safer",
          "Do not rely on one gadget for every scenario",
          "Learn the basics before an outage instead of reading instructions thirsty",
        ],
        body: [
          "Storage solves the short-term problem, but longer disruptions require a second layer. A filter, purification tablets, unscented household bleach where appropriate, or the ability to boil water gives you options if your stored supply runs low.",
          "Different tools solve different problems. Some filters remove sediment and many contaminants but not every biological or chemical risk. Tablets are compact and easy to stash, but they change taste and require wait time. Boiling works, but it requires fuel, a safe pot, and time.",
          "You do not need to turn your home into a water lab. You just need one or two backup methods you understand well enough to use under stress.",
        ],
      },
      {
        heading: "Build a simple home water plan",
        navLabel: "Build your plan",
        bullets: [
          "Write down how much you store, where it is, and when it gets checked",
          "List backup water sources and how you would transport or treat that water",
          "Assign who handles rotation, refills, and emergency setup if more than one adult is involved",
        ],
        body: [
          "A water supply becomes far more useful when it is part of a written plan. Keep a short note of how many gallons you have, where they are stored, which containers get used first, and which backup purification tools live with them.",
          "Also think beyond the house. If you had to leave, where would you get water on the road? If the disruption lasted longer, what local sources could you reach safely, and how would you carry that water home?",
          "Even a one-page plan removes friction. It helps every adult in the home understand the system, and it keeps your water prep from living only inside one person’s memory.",
        ],
      },
      {
        heading: "Common mistakes that make water prep weaker",
        navLabel: "Avoid mistakes",
        bullets: [
          "Storing too little because the math was never written down",
          "Buying large containers without testing whether you can actually move them",
          "Forgetting pets, medications, sanitation, or summer heat",
          "Owning filters but never reading the instructions or testing them",
        ],
        body: [
          "Most water-prep failures are boring, not dramatic. People underestimate how much they need, stash it somewhere hot, forget to label it, or assume they will figure purification out later.",
          "Another common mistake is focusing only on the gear. Fancy containers and filters do not help if the water is inaccessible, the lids are compromised, or nobody in the home remembers where the supplies are stored.",
          "The strongest system is usually simple: enough water for the first few days, containers you trust, a rotation schedule you follow, and one or two backup purification options that you have already practiced with once.",
        ],
      },
      {
        heading: "Simple water storage starter checklist",
        navLabel: "Starter checklist",
        bullets: [
          "Baseline storage: 1 gallon per person per day for at least 3 days",
          "Containers: food-safe bottles, jugs, or stackable water containers",
          "Storage location: cool, dark, clean spaces away from chemicals and direct sun",
          "Rotation: fill date labels plus a recurring calendar reminder",
          "Backup treatment: filter, tablets, boiling plan, or another approved option",
          "Written plan: where the water is, which containers get used first, and what happens if you need more",
        ],
        body: [
          "Start with enough drinking water for the household, then improve the system in layers. Add better containers, safer storage spots, a rotation routine, and one backup purification method you understand. Water preparedness works best when it is boring, dependable, and easy to maintain.",
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
