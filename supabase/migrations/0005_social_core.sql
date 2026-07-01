-- Social core: likes/comments/saves are already covered by 0001_init.sql.
-- This migration adds what's still missing: user-created spaces, a rename for
-- consistency (post_comments.author_id -> user_id, matching post_likes/post_saves),
-- and de-dupe guards on rig_items so "Add to Rig" is idempotent.

-- ---------------------------------------------------------------
-- post_comments: rename author_id -> user_id for consistency with
-- post_likes.user_id / post_saves.user_id
-- ---------------------------------------------------------------
alter table post_comments rename column author_id to user_id;
alter table post_comments rename constraint post_comments_author_id_fkey to post_comments_user_id_fkey;

create or replace function notify_on_comment()
returns trigger as $$
begin
  insert into notifications (recipient_id, actor_id, type, post_id, content)
  select p.author_id, new.user_id, 'comment', new.post_id, new.content
  from posts p where p.id = new.post_id and p.author_id <> new.user_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop policy "post_comments write" on post_comments;
drop policy "post_comments delete own" on post_comments;
create policy "post_comments write" on post_comments for insert to authenticated with check (user_id = auth.uid());
create policy "post_comments delete own" on post_comments for delete to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------
-- rig_items: prevent duplicate "add to rig" for the same catalog/custom item
-- ---------------------------------------------------------------
create unique index rig_items_user_gear_uidx on rig_items(user_id, gear_id) where gear_id is not null;
create unique index rig_items_user_custom_gear_uidx on rig_items(user_id, custom_gear_id) where custom_gear_id is not null;

-- ---------------------------------------------------------------
-- spaces: support user-created spaces alongside the fixed core catalog
-- ---------------------------------------------------------------
alter table spaces add column is_public boolean not null default true;
alter table spaces add column created_by uuid references profiles(id) on delete set null;

drop policy "catalog read" on spaces;

create policy "spaces read" on spaces for select to authenticated
  using (
    is_public = true
    or created_by = auth.uid()
    or id in (select space_id from space_members where user_id = auth.uid())
  );

-- Inserts/updates/deletes on user-created spaces all go through
-- create_user_space() below (security definer), so no direct write policies
-- are needed here beyond letting the RPC do its job.

create function create_user_space(space_name text, space_is_public boolean default true)
returns text as $$
declare
  new_id text := gen_random_uuid()::text;
begin
  insert into spaces (id, emoji, name, description, is_public, created_by)
  values (new_id, '🎵', space_name, '', space_is_public, auth.uid());
  insert into space_members (space_id, user_id) values (new_id, auth.uid());
  return new_id;
end;
$$ language plpgsql security definer set search_path = public;
