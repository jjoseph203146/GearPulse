-- GearPulse v1 schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

-- ============================================================
-- CATALOG TABLES (admin-managed, publicly readable, seeded data)
-- ============================================================

create table account_types (
  id text primary key,
  emoji text not null,
  name text not null,
  description text not null
);

create table instruments (
  id text primary key,
  emoji text not null,
  name text not null
);

create table spaces (
  id text primary key,
  emoji text not null,
  name text not null,
  description text not null,
  gradient text,
  image_url text
);

create table brands (
  id text primary key,
  emoji text not null,
  name text not null
);

create table gear_categories (
  id text primary key,
  emoji text not null,
  label text not null
);

create table gear (
  id text primary key,
  name text not null,
  brand text not null,
  category_id text not null references gear_categories(id),
  image_url text,
  description text,
  specs jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index gear_category_id_idx on gear(category_id);

-- ============================================================
-- PROFILES (1:1 with auth.users)
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_emoji text,
  avatar_url text,
  bio text,
  account_type text references account_types(id),
  verified boolean not null default false,
  push_notif boolean not null default true,
  private_account boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a placeholder profile row whenever a new auth user signs up,
-- so every other table's FK to profiles is satisfiable immediately, before
-- the user finishes the onboarding flow.
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'user_' || substr(new.id::text, 1, 8),
    coalesce(new.raw_user_meta_data->>'display_name', 'New User')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Profile <-> catalog join tables (onboarding selections)

create table profile_instruments (
  user_id uuid not null references profiles(id) on delete cascade,
  instrument_id text not null references instruments(id),
  primary key (user_id, instrument_id)
);

create table space_members (
  space_id text not null references spaces(id),
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id)
);
create index space_members_user_id_idx on space_members(user_id);

create table brand_follows (
  user_id uuid not null references profiles(id) on delete cascade,
  brand_id text not null references brands(id),
  created_at timestamptz not null default now(),
  primary key (user_id, brand_id)
);

create table follows (
  follower_id uuid not null references profiles(id) on delete cascade,
  followee_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
create index follows_followee_id_idx on follows(followee_id);

-- ============================================================
-- GEAR: user rigs + user-submitted custom gear
-- ============================================================

create table custom_gear (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references profiles(id) on delete cascade,
  name text not null,
  brand text,
  category_id text references gear_categories(id),
  mode text not null check (mode in ('profile', 'catalog')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
create index custom_gear_submitted_by_idx on custom_gear(submitted_by);

create table rig_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  gear_id text references gear(id),
  custom_gear_id uuid references custom_gear(id),
  acquired_year int,
  created_at timestamptz not null default now(),
  check (
    (gear_id is not null and custom_gear_id is null) or
    (gear_id is null and custom_gear_id is not null)
  )
);
create index rig_items_user_id_idx on rig_items(user_id);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  gear_id text not null references gear(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  text text,
  created_at timestamptz not null default now(),
  unique (gear_id, user_id)
);
create index reviews_gear_id_idx on reviews(gear_id);

-- ============================================================
-- POSTS / FEED
-- ============================================================

create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  space_id text references spaces(id),
  content text not null,
  image_url text,
  created_at timestamptz not null default now()
);
create index posts_author_id_idx on posts(author_id);
create index posts_space_id_idx on posts(space_id);
create index posts_created_at_idx on posts(created_at desc);

create table post_likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table post_saves (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create index post_comments_post_id_idx on post_comments(post_id);

-- ============================================================
-- MESSAGING
-- ============================================================

create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table conversation_participants (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);
create index conversation_participants_user_id_idx on conversation_participants(user_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index messages_conversation_id_idx on messages(conversation_id, created_at);

-- Atomically find-or-create a 1:1 conversation. All participant inserts go
-- through here so we don't need permissive RLS insert policies on
-- conversation_participants.
create function start_conversation(other_user uuid)
returns uuid as $$
declare
  conv_id uuid;
begin
  select c.id into conv_id
  from conversations c
  join conversation_participants p1 on p1.conversation_id = c.id and p1.user_id = auth.uid()
  join conversation_participants p2 on p2.conversation_id = c.id and p2.user_id = other_user
  limit 1;

  if conv_id is null then
    insert into conversations default values returning id into conv_id;
    insert into conversation_participants (conversation_id, user_id)
    values (conv_id, auth.uid()), (conv_id, other_user);
  end if;

  return conv_id;
end;
$$ language plpgsql security definer set search_path = public;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  actor_id uuid references profiles(id) on delete cascade,
  type text not null check (type in ('like', 'follow', 'comment', 'mention', 'announcement')),
  post_id uuid references posts(id) on delete cascade,
  space_id text references spaces(id),
  content text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_recipient_id_idx on notifications(recipient_id, created_at desc);

-- Auto-generate notifications for the three signals the app currently
-- surfaces: likes, follows, and comments.
create function notify_on_post_like()
returns trigger as $$
begin
  insert into notifications (recipient_id, actor_id, type, post_id)
  select p.author_id, new.user_id, 'like', new.post_id
  from posts p where p.id = new.post_id and p.author_id <> new.user_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_post_like
  after insert on post_likes
  for each row execute procedure notify_on_post_like();

create function notify_on_follow()
returns trigger as $$
begin
  insert into notifications (recipient_id, actor_id, type)
  values (new.followee_id, new.follower_id, 'follow');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_follow
  after insert on follows
  for each row execute procedure notify_on_follow();

create function notify_on_comment()
returns trigger as $$
begin
  insert into notifications (recipient_id, actor_id, type, post_id, content)
  select p.author_id, new.author_id, 'comment', new.post_id, new.content
  from posts p where p.id = new.post_id and p.author_id <> new.author_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_comment
  after insert on post_comments
  for each row execute procedure notify_on_comment();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table account_types enable row level security;
alter table instruments enable row level security;
alter table spaces enable row level security;
alter table brands enable row level security;
alter table gear_categories enable row level security;
alter table gear enable row level security;
alter table profiles enable row level security;
alter table profile_instruments enable row level security;
alter table space_members enable row level security;
alter table brand_follows enable row level security;
alter table follows enable row level security;
alter table custom_gear enable row level security;
alter table rig_items enable row level security;
alter table reviews enable row level security;
alter table posts enable row level security;
alter table post_likes enable row level security;
alter table post_saves enable row level security;
alter table post_comments enable row level security;
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

-- Catalogs: readable by any signed-in user, writable only via service_role.
create policy "catalog read" on account_types for select to authenticated using (true);
create policy "catalog read" on instruments for select to authenticated using (true);
create policy "catalog read" on spaces for select to authenticated using (true);
create policy "catalog read" on brands for select to authenticated using (true);
create policy "catalog read" on gear_categories for select to authenticated using (true);
create policy "catalog read" on gear for select to authenticated using (true);

-- Profiles: public read, self write.
create policy "profiles read" on profiles for select to authenticated using (true);
create policy "profiles update own" on profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Profile onboarding selections: public read (used on profile pages), self write.
create policy "profile_instruments read" on profile_instruments for select to authenticated using (true);
create policy "profile_instruments write" on profile_instruments for insert to authenticated with check (user_id = auth.uid());
create policy "profile_instruments delete" on profile_instruments for delete to authenticated using (user_id = auth.uid());

create policy "space_members read" on space_members for select to authenticated using (true);
create policy "space_members write" on space_members for insert to authenticated with check (user_id = auth.uid());
create policy "space_members delete" on space_members for delete to authenticated using (user_id = auth.uid());

create policy "brand_follows read own" on brand_follows for select to authenticated using (user_id = auth.uid());
create policy "brand_follows write" on brand_follows for insert to authenticated with check (user_id = auth.uid());
create policy "brand_follows delete" on brand_follows for delete to authenticated using (user_id = auth.uid());

create policy "follows read" on follows for select to authenticated using (true);
create policy "follows write" on follows for insert to authenticated with check (follower_id = auth.uid());
create policy "follows delete" on follows for delete to authenticated using (follower_id = auth.uid());

-- Gear: custom submissions + rigs + reviews.
create policy "custom_gear read" on custom_gear for select to authenticated using (true);
create policy "custom_gear write" on custom_gear for insert to authenticated with check (submitted_by = auth.uid());
create policy "custom_gear update own pending" on custom_gear for update to authenticated
  using (submitted_by = auth.uid() and status = 'pending') with check (submitted_by = auth.uid());
create policy "custom_gear delete own" on custom_gear for delete to authenticated using (submitted_by = auth.uid());

create policy "rig_items read" on rig_items for select to authenticated using (true);
create policy "rig_items write" on rig_items for insert to authenticated with check (user_id = auth.uid());
create policy "rig_items delete own" on rig_items for delete to authenticated using (user_id = auth.uid());

create policy "reviews read" on reviews for select to authenticated using (true);
create policy "reviews write" on reviews for insert to authenticated with check (user_id = auth.uid());
create policy "reviews update own" on reviews for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reviews delete own" on reviews for delete to authenticated using (user_id = auth.uid());

-- Posts + engagement.
create policy "posts read" on posts for select to authenticated using (true);
create policy "posts write" on posts for insert to authenticated with check (author_id = auth.uid());
create policy "posts update own" on posts for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "posts delete own" on posts for delete to authenticated using (author_id = auth.uid());

create policy "post_likes read" on post_likes for select to authenticated using (true);
create policy "post_likes write" on post_likes for insert to authenticated with check (user_id = auth.uid());
create policy "post_likes delete own" on post_likes for delete to authenticated using (user_id = auth.uid());

create policy "post_saves read own" on post_saves for select to authenticated using (user_id = auth.uid());
create policy "post_saves write" on post_saves for insert to authenticated with check (user_id = auth.uid());
create policy "post_saves delete own" on post_saves for delete to authenticated using (user_id = auth.uid());

create policy "post_comments read" on post_comments for select to authenticated using (true);
create policy "post_comments write" on post_comments for insert to authenticated with check (author_id = auth.uid());
create policy "post_comments delete own" on post_comments for delete to authenticated using (author_id = auth.uid());

-- Messaging: participants only. All rows are created via start_conversation(),
-- so there are no end-user insert policies on conversations/participants.
create policy "conversations read" on conversations for select to authenticated
  using (id in (select conversation_id from conversation_participants where user_id = auth.uid()));

create policy "conversation_participants read" on conversation_participants for select to authenticated
  using (conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid()));

create policy "messages read" on messages for select to authenticated
  using (conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid()));
create policy "messages write" on messages for insert to authenticated
  with check (
    sender_id = auth.uid() and
    conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid())
  );
create policy "messages mark read" on messages for update to authenticated
  using (conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid()))
  with check (conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid()));

-- Notifications: recipient only. Rows are created by the triggers above
-- (security definer), so there is no end-user insert policy.
create policy "notifications read own" on notifications for select to authenticated using (recipient_id = auth.uid());
create policy "notifications mark read" on notifications for update to authenticated
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
