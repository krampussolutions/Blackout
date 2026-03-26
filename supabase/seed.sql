-- Basic content seeds for Blackout Network
-- Run this after schema.sql

insert into public.categories (name, slug, description)
values
  ('General Preparedness', 'general-preparedness', 'Core planning, checklists, and all-around readiness.'),
  ('Power Outages', 'power-outages', 'Grid-down planning, generators, lighting, and fuel storage.'),
  ('Water & Filtration', 'water-filtration', 'Storage, purification, gravity filters, and backup supply plans.'),
  ('Food Storage', 'food-storage', 'Pantry rotation, long-term storage, freeze-dried food, and canning.'),
  ('Medical', 'medical', 'First aid kits, trauma prep, prescriptions, and field care basics.'),
  ('Comms', 'comms', 'Ham radio, emergency signals, batteries, and off-grid communications.')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description;

insert into public.groups (name, slug, description)
values
  ('Power Outages', 'power-outages', 'Share blackout updates, backup power setups, outage prep, and grid-down experience.'),
  ('Off Grid Living', 'off-grid-living', 'Discuss solar, water, cabins, batteries, generators, and living off-grid.'),
  ('Food Storage', 'food-storage', 'Long-term pantry planning, freeze-dried food, canning, and rotation systems.'),
  ('Water & Filtration', 'water-filtration', 'Storage, purification, wells, filters, and emergency water planning.'),
  ('Medical / First Aid', 'medical-first-aid', 'Preparedness-minded discussion around kits, supplies, and first aid readiness.'),
  ('Comms', 'comms-group', 'Ham radio, emergency communications, signal planning, and backup communication methods.'),
  ('Homesteading', 'homesteading', 'Gardens, livestock, self-reliance, preserving food, and homestead systems.'),
  ('Security', 'security', 'Home hardening, awareness, lighting, cameras, and practical safety planning.')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description;

-- Note:
-- Sample member profiles and starter post content also live in src/lib/site.ts as fallback content
-- so the site looks populated before you have a lot of real users.
