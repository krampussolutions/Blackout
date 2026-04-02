alter table public.profiles
  add column if not exists founder_badge_earned boolean not null default false,
  add column if not exists founder_badge_awarded_at timestamptz;

create or replace function public.award_founder_badge_for_inviter(inviter_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if inviter_profile_id is null then
    return;
  end if;

  update public.profiles
  set founder_badge_earned = true,
      founder_badge_awarded_at = coalesce(founder_badge_awarded_at, now())
  where id = inviter_profile_id
    and coalesce(founder_badge_earned, false) = false
    and (
      select count(*)
      from public.profiles invited_profiles
      where invited_profiles.invited_by = inviter_profile_id
    ) >= 10;
end;
$$;

update public.profiles profile_row
set founder_badge_earned = true,
    founder_badge_awarded_at = coalesce(profile_row.founder_badge_awarded_at, now())
where coalesce(profile_row.founder_badge_earned, false) = false
  and (
    select count(*)
    from public.profiles invited_profiles
    where invited_profiles.invited_by = profile_row.id
  ) >= 10;

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

    perform public.award_founder_badge_for_inviter(inviter);
  end if;

  return new;
end;
$$;
