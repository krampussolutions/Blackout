create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  cover_url text,
  location text,
  interests text[] default '{}'::text[],
  membership_tier text default 'free' check (membership_tier in ('free', 'premium', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles add column if not exists cover_url text;
alter table public.profiles add column if not exists interests text[] default '{}'::text[];
alter table public.profiles add column if not exists invite_announcement_seen_version integer not null default 0;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  content text not null,
  image_url text,
  visibility text default 'public' check (visibility in ('public', 'members')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(comment_id, user_id)
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);


create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz default now(),
  unique(post_id, reporter_id)
);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1))),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set username = excluded.username,
      display_name = excluded.display_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.comment_likes enable row level security;
alter table public.follows enable row level security;
alter table public.post_reports enable row level security;

 drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Categories are readable by everyone" on public.categories;
drop policy if exists "Posts are readable by everyone" on public.posts;
drop policy if exists "Comments are readable by everyone" on public.comments;
drop policy if exists "Likes are readable by everyone" on public.likes;
drop policy if exists "Comment likes are readable by everyone" on public.comment_likes;
drop policy if exists "Follows are readable by everyone" on public.follows;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Authenticated users can insert posts" on public.posts;
drop policy if exists "Users can update their own posts" on public.posts;
drop policy if exists "Users can delete their own posts" on public.posts;
drop policy if exists "Admins can delete any post" on public.posts;
drop policy if exists "Authenticated users can insert comments" on public.comments;
drop policy if exists "Authenticated users can like posts" on public.likes;

drop policy if exists "Users can unlike posts" on public.likes;
drop policy if exists "Users can delete their own comments" on public.comments;
drop policy if exists "Users can update their own comments" on public.comments;
drop policy if exists "Authenticated users can follow other users" on public.follows;
drop policy if exists "Users can unfollow people they follow" on public.follows;
drop policy if exists "Admins can delete reports" on public.post_reports;
drop policy if exists "Admins can update reports" on public.post_reports;
drop policy if exists "Authenticated users can report posts" on public.post_reports;
drop policy if exists "Post reports are readable by admins" on public.post_reports;
drop policy if exists "Avatar images are public" on storage.objects;
drop policy if exists "Authenticated users can upload avatars" on storage.objects;
drop policy if exists "Authenticated users can update avatars" on storage.objects;
drop policy if exists "Authenticated users can delete avatars" on storage.objects;
drop policy if exists "Cover images are public" on storage.objects;
drop policy if exists "Authenticated users can upload covers" on storage.objects;
drop policy if exists "Authenticated users can update covers" on storage.objects;
drop policy if exists "Authenticated users can delete covers" on storage.objects;

create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Categories are readable by everyone" on public.categories for select using (true);
create policy "Posts are readable by everyone" on public.posts for select using (true);
create policy "Comments are readable by everyone" on public.comments for select using (true);
create policy "Likes are readable by everyone" on public.likes for select using (true);
create policy "Comment likes are readable by everyone" on public.comment_likes for select using (true);
create policy "Follows are readable by everyone" on public.follows for select using (true);

create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Authenticated users can insert posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can update their own posts" on public.posts for update using (auth.uid() = user_id);
create policy "Users can delete their own posts" on public.posts for delete using (auth.uid() = user_id);
create policy "Admins can delete any post" on public.posts for delete using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.membership_tier = 'admin'
  )
);
create policy "Authenticated users can insert comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Authenticated users can like posts" on public.likes for insert with check (auth.uid() = user_id);
create policy "Authenticated users can like comments" on public.comment_likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike posts" on public.likes for delete using (auth.uid() = user_id);
create policy "Users can unlike comments" on public.comment_likes for delete using (auth.uid() = user_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = user_id);
create policy "Users can update their own comments" on public.comments for update using (auth.uid() = user_id);
create policy "Authenticated users can follow other users" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow people they follow" on public.follows for delete using (auth.uid() = follower_id);


create policy "Post reports are readable by admins" on public.post_reports for select using (
  exists (
    select 1 from public.profiles as admin_profile
    where admin_profile.id = auth.uid() and admin_profile.membership_tier = 'admin'
  )
);
create policy "Authenticated users can report posts" on public.post_reports for insert with check (auth.uid() = reporter_id);
create policy "Admins can update reports" on public.post_reports for update using (
  exists (
    select 1 from public.profiles as admin_profile
    where admin_profile.id = auth.uid() and admin_profile.membership_tier = 'admin'
  )
);
create policy "Admins can delete reports" on public.post_reports for delete using (
  exists (
    select 1 from public.profiles as admin_profile
    where admin_profile.id = auth.uid() and admin_profile.membership_tier = 'admin'
  )
);

create policy "Avatar images are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Authenticated users can upload avatars" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Authenticated users can update avatars" on storage.objects for update using (
  bucket_id = 'avatars' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Authenticated users can delete avatars" on storage.objects for delete using (
  bucket_id = 'avatars' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Cover images are public" on storage.objects for select using (bucket_id = 'covers');
create policy "Authenticated users can upload covers" on storage.objects for insert with check (
  bucket_id = 'covers' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Authenticated users can update covers" on storage.objects for update using (
  bucket_id = 'covers' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Authenticated users can delete covers" on storage.objects for delete using (
  bucket_id = 'covers' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text
);


drop policy if exists "Admins can update member roles" on public.profiles;
drop policy if exists "Admins can delete any comment" on public.comments;

create policy "Admins can update member roles" on public.profiles for update using (
  exists (
    select 1 from public.profiles as admin_profile
    where admin_profile.id = auth.uid() and admin_profile.membership_tier = 'admin'
  )
);

create policy "Admins can delete any comment" on public.comments for delete using (
  exists (
    select 1 from public.profiles as admin_profile
    where admin_profile.id = auth.uid() and admin_profile.membership_tier = 'admin'
  )
);


-- Messaging
create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz default now(),
  check (sender_id <> recipient_id)
);
create index if not exists direct_messages_sender_created_idx on public.direct_messages (sender_id, created_at desc);
create index if not exists direct_messages_recipient_created_idx on public.direct_messages (recipient_id, created_at desc);
alter table public.direct_messages enable row level security;
drop policy if exists "Participants can read their messages" on public.direct_messages;
drop policy if exists "Authenticated users can send messages" on public.direct_messages;
drop policy if exists "Recipients can mark messages as read" on public.direct_messages;
create policy "Participants can read their messages" on public.direct_messages for select using (
  auth.uid() = sender_id or auth.uid() = recipient_id
);
create policy "Authenticated users can send messages" on public.direct_messages for insert with check (
  auth.uid() = sender_id
);
create policy "Recipients can mark messages as read" on public.direct_messages for update using (
  auth.uid() = recipient_id
) with check (
  auth.uid() = recipient_id
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  cover_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table public.posts add column if not exists group_id uuid references public.groups(id) on delete set null;

create index if not exists groups_slug_idx on public.groups(slug);
create index if not exists group_members_group_id_idx on public.group_members(group_id);
create index if not exists group_members_user_id_idx on public.group_members(user_id);
create index if not exists posts_group_id_idx on public.posts(group_id);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

drop policy if exists "Anyone can view groups" on public.groups;
drop policy if exists "Authenticated users can create groups" on public.groups;
drop policy if exists "Group creators can update groups" on public.groups;
drop policy if exists "Group creators can delete groups" on public.groups;
drop policy if exists "Anyone can view group members" on public.group_members;
drop policy if exists "Authenticated users can join groups" on public.group_members;
drop policy if exists "Users can leave groups" on public.group_members;
drop policy if exists "Group creator can manage members" on public.group_members;
drop policy if exists "Authenticated users can create posts" on public.posts;
drop policy if exists "Users can update their own posts" on public.posts;

create policy "Anyone can view groups" on public.groups for select using (true);
create policy "Authenticated users can create groups" on public.groups for insert to authenticated with check (auth.uid() = created_by);
create policy "Group creators can update groups" on public.groups for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
create policy "Group creators can delete groups" on public.groups for delete to authenticated using (auth.uid() = created_by);

create policy "Anyone can view group members" on public.group_members for select using (true);
create policy "Authenticated users can join groups" on public.group_members for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can leave groups" on public.group_members for delete to authenticated using (auth.uid() = user_id);
create policy "Group creator can manage members" on public.group_members for all to authenticated using (
  exists (
    select 1 from public.groups g where g.id = group_members.group_id and g.created_by = auth.uid()
  )
) with check (
  exists (
    select 1 from public.groups g where g.id = group_members.group_id and g.created_by = auth.uid()
  )
);

create policy "Authenticated users can create posts" on public.posts for insert with check (
  auth.uid() = user_id
  and (
    group_id is null
    or exists (
      select 1 from public.group_members gm
      where gm.group_id = posts.group_id and gm.user_id = auth.uid()
    )
  )
);

create policy "Users can update their own posts" on public.posts for update using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and (
    group_id is null
    or exists (
      select 1 from public.group_members gm
      where gm.group_id = posts.group_id and gm.user_id = auth.uid()
    )
  )
);

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
on conflict (slug) do nothing;


create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('like', 'comment', 'follow', 'message')),
  post_id uuid references public.posts(id) on delete cascade,
  metadata jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
  on public.notifications
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Actors can create notifications" on public.notifications;
create policy "Actors can create notifications"
  on public.notifications
  for insert
  to authenticated
  with check (actor_id = auth.uid() and actor_id <> user_id);
