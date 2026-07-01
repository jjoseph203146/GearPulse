import { supabase } from "@/lib/supabase";
import type { Post, PostComment } from "@/types";

const POST_SELECT =
  "id, content, image_url, created_at, space_id, author_id, author:profiles!posts_author_id_fkey(id,username,display_name,avatar_url,avatar_emoji,verified)";

type RawPost = Omit<Post, "like_count" | "comment_count" | "liked_by_me" | "saved_by_me">;

async function enrichPosts(posts: RawPost[], userId: string, forceSaved = false): Promise<Post[]> {
  if (posts.length === 0) return [];
  const ids = posts.map((p) => p.id);

  const [{ data: likes }, { data: comments }, { data: mySaves }] = await Promise.all([
    supabase.from("post_likes").select("post_id,user_id").in("post_id", ids),
    supabase.from("post_comments").select("post_id").in("post_id", ids),
    forceSaved ? Promise.resolve({ data: null }) : supabase.from("post_saves").select("post_id").eq("user_id", userId).in("post_id", ids),
  ]);

  const likeCounts = new Map<string, number>();
  const likedByMe = new Set<string>();
  for (const l of likes ?? []) {
    likeCounts.set(l.post_id, (likeCounts.get(l.post_id) ?? 0) + 1);
    if (l.user_id === userId) likedByMe.add(l.post_id);
  }
  const commentCounts = new Map<string, number>();
  for (const c of comments ?? []) commentCounts.set(c.post_id, (commentCounts.get(c.post_id) ?? 0) + 1);
  const savedByMe = new Set((mySaves ?? []).map((s) => s.post_id));

  return posts.map((p) => ({
    ...p,
    like_count: likeCounts.get(p.id) ?? 0,
    comment_count: commentCounts.get(p.id) ?? 0,
    liked_by_me: likedByMe.has(p.id),
    saved_by_me: forceSaved ? true : savedByMe.has(p.id),
  }));
}

export async function fetchFeed(userId: string): Promise<Post[]> {
  const [{ data: mySpaces }, { data: myFollows }] = await Promise.all([
    supabase.from("space_members").select("space_id").eq("user_id", userId),
    supabase.from("follows").select("followee_id").eq("follower_id", userId),
  ]);
  const spaceIds = (mySpaces ?? []).map((r) => r.space_id);
  const followeeIds = (myFollows ?? []).map((r) => r.followee_id);

  let posts: RawPost[] = [];

  const orParts: string[] = [];
  if (spaceIds.length) orParts.push(`space_id.in.(${spaceIds.join(",")})`);
  if (followeeIds.length) orParts.push(`author_id.in.(${followeeIds.join(",")})`);

  if (orParts.length) {
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .or(orParts.join(","))
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    posts = (data ?? []) as unknown as RawPost[];
  }

  // Fallback / backfill content so a new user's feed isn't empty: recent posts
  // from across the whole app (acts as "GearPulse official" discovery content).
  if (posts.length < 5) {
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    const seen = new Set(posts.map((p) => p.id));
    for (const p of (data ?? []) as unknown as RawPost[]) {
      if (!seen.has(p.id)) {
        posts.push(p);
        seen.add(p.id);
      }
    }
    posts.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    posts = posts.slice(0, 30);
  }

  return enrichPosts(posts, userId);
}

export async function fetchSavedPosts(userId: string): Promise<Post[]> {
  const { data: saves, error: savesError } = await supabase
    .from("post_saves")
    .select("post_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (savesError) throw savesError;
  const ids = (saves ?? []).map((s) => s.post_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from("posts").select(POST_SELECT).in("id", ids);
  if (error) throw error;

  const order = new Map(ids.map((id, i) => [id, i]));
  const posts = ((data ?? []) as unknown as RawPost[]).sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  return enrichPosts(posts, userId, true);
}

export async function fetchPostsBySpace(spaceId: string, userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return enrichPosts((data ?? []) as unknown as RawPost[], userId);
}

export async function toggleLike(postId: string, userId: string, currentlyLiked: boolean) {
  if (currentlyLiked) {
    const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("post_likes")
      .upsert({ post_id: postId, user_id: userId }, { onConflict: "post_id,user_id", ignoreDuplicates: true });
    if (error) throw error;
  }
}

export async function toggleSave(postId: string, userId: string, currentlySaved: boolean) {
  if (currentlySaved) {
    const { error } = await supabase.from("post_saves").delete().eq("post_id", postId).eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("post_saves")
      .upsert({ post_id: postId, user_id: userId }, { onConflict: "post_id,user_id", ignoreDuplicates: true });
    if (error) throw error;
  }
}

export async function fetchComments(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from("post_comments")
    .select("id, post_id, content, created_at, author:profiles!post_comments_user_id_fkey(id,username,display_name,avatar_url,avatar_emoji,verified)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as PostComment[];
}

export async function addComment(postId: string, userId: string, content: string): Promise<PostComment> {
  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, user_id: userId, content })
    .select("id, post_id, content, created_at, author:profiles!post_comments_user_id_fkey(id,username,display_name,avatar_url,avatar_emoji,verified)")
    .single();
  if (error) throw error;
  return data as unknown as PostComment;
}

export async function createPost(userId: string, content: string, spaceId: string | null, imageUrl: string | null) {
  const { error } = await supabase
    .from("posts")
    .insert({ author_id: userId, content, space_id: spaceId, image_url: imageUrl });
  if (error) throw error;
}
