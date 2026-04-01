create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(comment_id, user_id)
);

alter table public.comment_likes enable row level security;

drop policy if exists "Comment likes are readable by everyone" on public.comment_likes;
drop policy if exists "Authenticated users can like comments" on public.comment_likes;
drop policy if exists "Users can unlike comments" on public.comment_likes;

create policy "Comment likes are readable by everyone"
on public.comment_likes
for select
using (true);

create policy "Authenticated users can like comments"
on public.comment_likes
for insert
with check (auth.uid() = user_id);

create policy "Users can unlike comments"
on public.comment_likes
for delete
using (auth.uid() = user_id);

create index if not exists comment_likes_comment_id_idx on public.comment_likes (comment_id);
create index if not exists comment_likes_user_id_idx on public.comment_likes (user_id);
