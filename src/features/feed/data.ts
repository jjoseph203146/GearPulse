import { supabase } from "@/lib/supabase";
import type { Post, PostComment, PostGearTag } from "@/types";

export const POST_SELECT =
  "id, content, image_url, created_at, space_id, author_id, author:profiles!posts_author_id_fkey(id,username,display_name,avatar_url,avatar_emoji,verified)";

export type RawPost = Omit<Post, "like_count" | "comment_count" | "liked_by_me" | "saved_by_me" | "gear">;

type RawGearTagRow = {
  id: string;
  post_id: string;
  gear: { id: string; name: string; image_url: string | null; category: { emoji: string } | null } | null;
  custom_gear: { id: string; name: string } | null;
};

async function fetchGearTagsByPost(postIds: string[]): Promise<Map<string, PostGearTag[]>> {
  const byPost = new Map<string, PostGearTag[]>();
  if (postIds.length === 0) return byPost;

  const { data, error } = await supabase
    .from("post_gear")
    .select("id, post_id, gear:gear(id,name,image_url,category:gear_categories(emoji)), custom_gear:custom_gear(id,name)")
    .in("post_id", postIds);
  if (error) throw error;

  for (const row of (data ?? []) as unknown as RawGearTagRow[]) {
    const tag: PostGearTag = row.gear
      ? { id: row.id, refId: row.gear.id, name: row.gear.name, emoji: row.gear.category?.emoji ?? "🎵", image: row.gear.image_url ?? "" }
      : { id: row.id, refId: null, name: row.custom_gear?.name ?? "Custom gear", emoji: "🛠️", image: "" };
    const list = byPost.get(row.post_id) ?? [];
    list.push(tag);
    byPost.set(row.post_id, list);
  }
  return byPost;
}

export async function enrichPosts(posts: RawPost[], userId: string, forceSaved = false): Promise<Post[]> {
  if (posts.length === 0) return [];
  const ids = posts.map((p) => p.id);

  const [{ data: likes }, { data: comments }, { data: mySaves }, gearByPost] = await Promise.all([
    supabase.from("post_likes").select("post_id,user_id").in("post_id", ids),
    supabase.from("post_comments").select("post_id").in("post_id", ids),
    forceSaved ? Promise.resolve({ data: null }) : supabase.from("post_saves").select("post_id").eq("user_id", userId).in("post_id", ids),
    fetchGearTagsByPost(ids),
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
    gear: gearByPost.get(p.id) ?? [],
  }));
}

// Lightweight v1 ranking: a hand-rolled point score, computed client-side and
// sorted in memory. No ML, no SQL-side ranking — just a tiebreak-friendly
// weighting so the feed feels a little personalized without being complex.
function scorePost(post: Post, spaceIds: Set<string>, followeeIds: Set<string>, ownedGearIds: Set<string>): number {
  let score = 0;
  if (followeeIds.has(post.author_id)) score += 5;
  if (post.space_id && spaceIds.has(post.space_id)) score += 5;
  if (post.gear.some((g) => g.refId && ownedGearIds.has(g.refId))) score += 2;
  score += post.like_count * 1;
  score += post.comment_count * 2;
  return score;
}

function rankPosts(posts: Post[], spaceIds: Set<string>, followeeIds: Set<string>, ownedGearIds: Set<string>): Post[] {
  return [...posts].sort((a, b) => {
    const diff = scorePost(b, spaceIds, followeeIds, ownedGearIds) - scorePost(a, spaceIds, followeeIds, ownedGearIds);
    if (diff !== 0) return diff;
    return +new Date(b.created_at) - +new Date(a.created_at);
  });
}

export async function fetchFeed(userId: string): Promise<Post[]> {
  const [{ data: mySpaces }, { data: myFollows }, { data: myGear }] = await Promise.all([
    supabase.from("space_members").select("space_id").eq("user_id", userId),
    supabase.from("follows").select("followee_id").eq("follower_id", userId),
    supabase.from("rig_items").select("gear_id").eq("user_id", userId).not("gear_id", "is", null),
  ]);
  const spaceIdList = (mySpaces ?? []).map((r) => r.space_id);
  const followeeIdList = (myFollows ?? []).map((r) => r.followee_id);
  const spaceIds = new Set(spaceIdList);
  const followeeIds = new Set(followeeIdList);
  const ownedGearIds = new Set((myGear ?? []).map((r) => r.gear_id).filter((id): id is string => !!id));

  let posts: RawPost[] = [];

  const orParts: string[] = [];
  if (spaceIdList.length) orParts.push(`space_id.in.(${spaceIdList.join(",")})`);
  if (followeeIdList.length) orParts.push(`author_id.in.(${followeeIdList.join(",")})`);

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

  // Hybrid fallback so a new user (or one with no follows/spaces yet) never
  // sees an empty feed: backfill with recent posts from across the app.
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
    posts = posts.slice(0, 30);
  }

  const enriched = await enrichPosts(posts, userId);
  return rankPosts(enriched, spaceIds, followeeIds, ownedGearIds);
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

export async function fetchPostsByGear(gearId: string, userId: string, limit = 20): Promise<Post[]> {
  const { data: tagRows, error: tagError } = await supabase.from("post_gear").select("post_id").eq("gear_id", gearId);
  if (tagError) throw tagError;
  const postIds = (tagRows ?? []).map((r) => r.post_id);
  if (postIds.length === 0) return [];

  const { data, error } = await supabase.from("posts").select(POST_SELECT).in("id", postIds);
  if (error) throw error;

  const enriched = await enrichPosts((data ?? []) as unknown as RawPost[], userId);
  return enriched.sort((a, b) => b.like_count - a.like_count || +new Date(b.created_at) - +new Date(a.created_at)).slice(0, limit);
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

export async function createPost(
  userId: string,
  content: string,
  spaceId: string | null,
  imageUrl: string | null,
): Promise<string> {
  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: userId, content, space_id: spaceId, image_url: imageUrl })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function tagPostGear(postId: string, tags: { gearId: string | null; customGearId: string | null }[]) {
  if (tags.length === 0) return;
  const rows = tags.map((t) => ({ post_id: postId, gear_id: t.gearId, custom_gear_id: t.customGearId }));
  const { error } = await supabase.from("post_gear").insert(rows);
  if (error) throw error;
}
