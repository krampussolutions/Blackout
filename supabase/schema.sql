create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  location text,
  membership_tier text default 'free' check (membership_tier in ('free', 'premium', 'admin')),
  created_at timestamptz default now()
);

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
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1)),
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
create policy "Authenticated users can insert comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Authenticated users can like posts" on public.likes for insert with check (auth.uid() = user_id);
create policy "Authenticated users can follow other users" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow people they follow" on public.follows for delete using (auth.uid() = follower_id);
