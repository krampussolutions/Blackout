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
alter table public.follows enable row level security;
alter table public.post_reports enable row level security;

 drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Categories are readable by everyone" on public.categories;
drop policy if exists "Posts are readable by everyone" on public.posts;
drop policy if exists "Comments are readable by everyone" on public.comments;
drop policy if exists "Likes are readable by everyone" on public.likes;
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

create policy "Users can unlike posts" on public.likes for delete using (auth.uid() = user_id);
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
