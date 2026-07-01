-- Video posts: users can attach a recorded or uploaded video to a post
-- instead of (or alongside) an image. Storage mirrors the avatars bucket
-- pattern: public read, owner-only write under their own user-id folder.

alter table posts add column if not exists video_url text;

insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

drop policy if exists "Post media is publicly readable" on storage.objects;
drop policy if exists "Users can upload their own post media" on storage.objects;
drop policy if exists "Users can update their own post media" on storage.objects;
drop policy if exists "Users can delete their own post media" on storage.objects;

create policy "Post media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'post-media');

create policy "Users can upload their own post media"
  on storage.objects for insert
  with check (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own post media"
  on storage.objects for update
  using (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own post media"
  on storage.objects for delete
  using (
    bucket_id = 'post-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
