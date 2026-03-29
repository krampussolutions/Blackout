alter table public.profiles add column if not exists invited_by uuid references public.profiles(id);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('like', 'comment', 'follow', 'group_join', 'message', 'system')),
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  group_id uuid references public.groups(id) on delete cascade,
  message_id uuid references public.direct_messages(id) on delete cascade,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_read_created_idx on public.notifications (user_id, read_at, created_at desc);
create index if not exists notifications_actor_idx on public.notifications (actor_id);

create table if not exists public.invite_links (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  code text not null unique,
  label text,
  created_at timestamptz not null default now()
);
create index if not exists invite_links_inviter_idx on public.invite_links (inviter_id, created_at desc);

alter table public.notifications enable row level security;
alter table public.invite_links enable row level security;

drop policy if exists "Users can view their notifications" on public.notifications;
drop policy if exists "Actors can create notifications" on public.notifications;
drop policy if exists "Recipients can update their notifications" on public.notifications;
create policy "Users can view their notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Actors can create notifications" on public.notifications for insert with check (
  auth.uid() = actor_id
  and auth.uid() <> user_id
);
create policy "Recipients can update their notifications" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can view their invite links" on public.invite_links;
drop policy if exists "Users can create their invite links" on public.invite_links;
drop policy if exists "Users can update their invite links" on public.invite_links;
drop policy if exists "Users can delete their invite links" on public.invite_links;
create policy "Users can view their invite links" on public.invite_links for select using (auth.uid() = inviter_id);
create policy "Users can create their invite links" on public.invite_links for insert with check (auth.uid() = inviter_id);
create policy "Users can update their invite links" on public.invite_links for update using (auth.uid() = inviter_id) with check (auth.uid() = inviter_id);
create policy "Users can delete their invite links" on public.invite_links for delete using (auth.uid() = inviter_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, invited_by)
  values (
    new.id,
    lower(coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1))),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)),
    (
      select inviter_id
      from public.invite_links
      where code = nullif(new.raw_user_meta_data ->> 'invite_code', '')
      limit 1
    )
  )
  on conflict (id) do update
  set username = excluded.username,
      display_name = excluded.display_name,
      invited_by = coalesce(public.profiles.invited_by, excluded.invited_by);

  return new;
end;
$$;
