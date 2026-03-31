alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('like', 'comment', 'follow', 'group_join', 'message', 'invite_accepted', 'system'));

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  email_like boolean not null default true,
  email_comment boolean not null default true,
  email_follow boolean not null default true,
  email_group_join boolean not null default true,
  email_message boolean not null default true,
  email_invite_accepted boolean not null default true,
  email_system boolean not null default true,
  push_enabled boolean not null default true,
  push_like boolean not null default true,
  push_comment boolean not null default true,
  push_follow boolean not null default true,
  push_group_join boolean not null default true,
  push_message boolean not null default true,
  push_invite_accepted boolean not null default true,
  push_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text,
  auth text,
  user_agent text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id, created_at desc);

alter table public.notification_preferences enable row level security;
alter table public.push_subscriptions enable row level security;

drop policy if exists "Users can view their own notification preferences" on public.notification_preferences;
drop policy if exists "Users can upsert their own notification preferences" on public.notification_preferences;
drop policy if exists "Users can update their own notification preferences" on public.notification_preferences;
drop policy if exists "Users can view their own push subscriptions" on public.push_subscriptions;
drop policy if exists "Users can create their own push subscriptions" on public.push_subscriptions;
drop policy if exists "Users can update their own push subscriptions" on public.push_subscriptions;
drop policy if exists "Users can delete their own push subscriptions" on public.push_subscriptions;

create policy "Users can view their own notification preferences" on public.notification_preferences for select using (auth.uid() = user_id);
create policy "Users can upsert their own notification preferences" on public.notification_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update their own notification preferences" on public.notification_preferences for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can view their own push subscriptions" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy "Users can create their own push subscriptions" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can update their own push subscriptions" on public.push_subscriptions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own push subscriptions" on public.push_subscriptions for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inviter uuid;
begin
  inviter := (
    select inviter_id
    from public.invite_links
    where code = nullif(new.raw_user_meta_data ->> 'invite_code', '')
    limit 1
  );

  insert into public.profiles (id, username, display_name, invited_by)
  values (
    new.id,
    lower(coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1))),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)),
    inviter
  )
  on conflict (id) do update
  set username = excluded.username,
      display_name = excluded.display_name,
      invited_by = coalesce(public.profiles.invited_by, excluded.invited_by);

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  if inviter is not null and inviter <> new.id then
    insert into public.notifications (user_id, actor_id, type, metadata)
    values (
      inviter,
      new.id,
      'invite_accepted',
      jsonb_build_object('text', coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)) || ' joined Blackout Network from your invite.')
    );
  end if;

  return new;
end;
$$;
