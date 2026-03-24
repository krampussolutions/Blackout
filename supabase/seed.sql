insert into public.categories (name, slug, description)
values
  ('General Preparedness', 'general-preparedness', 'Core readiness discussions and planning.'),
  ('Power Outages', 'power-outages', 'Generators, blackout planning, fuel storage, and grid-down prep.'),
  ('Water & Filtration', 'water-filtration', 'Water storage, treatment, and purification systems.'),
  ('Food Storage', 'food-storage', 'Long-term food, canning, freeze-dried meals, and rotation.'),
  ('Comms', 'comms', 'Ham radio, emergency communication, and off-grid communications.'),
  ('Medical', 'medical', 'First aid, trauma kits, and emergency medical prep.')
on conflict (slug) do nothing;
