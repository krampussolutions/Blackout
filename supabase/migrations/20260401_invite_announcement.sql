alter table public.profiles
  add column if not exists invite_announcement_seen_version integer not null default 0;
