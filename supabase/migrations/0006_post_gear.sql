-- The missing identity layer: link posts to the gear they showcase.
-- Without this, gear is just profile decoration. With it, gear becomes a
-- social object: "top posts using X", "trending gear in a space", "most
-- used gear globally", and a gear-ownership signal for feed ranking.
--
-- Safe to re-run.

create table if not exists post_gear (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  gear_id text references gear(id) on delete cascade,
  custom_gear_id uuid references custom_gear(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (gear_id is not null and custom_gear_id is null) or
    (gear_id is null and custom_gear_id is not null)
  )
);

create unique index if not exists post_gear_post_gear_uidx on post_gear(post_id, gear_id) where gear_id is not null;
create unique index if not exists post_gear_post_custom_gear_uidx on post_gear(post_id, custom_gear_id) where custom_gear_id is not null;
create index if not exists post_gear_gear_id_idx on post_gear(gear_id);
create index if not exists post_gear_post_id_idx on post_gear(post_id);

alter table post_gear enable row level security;

drop policy if exists "post_gear read" on post_gear;
drop policy if exists "post_gear write" on post_gear;
drop policy if exists "post_gear delete own" on post_gear;

create policy "post_gear read" on post_gear for select to authenticated using (true);

create policy "post_gear write" on post_gear for insert to authenticated
  with check (exists (select 1 from posts p where p.id = post_id and p.author_id = auth.uid()));

create policy "post_gear delete own" on post_gear for delete to authenticated
  using (exists (select 1 from posts p where p.id = post_id and p.author_id = auth.uid()));
