import { supabase } from "@/lib/supabase";
import { enrichPosts, POST_SELECT, type RawPost } from "@/features/feed/data";
import type { Post, PostAuthor } from "@/types";

export async function searchPosts(query: string, userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .ilike("content", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return enrichPosts((data ?? []) as unknown as RawPost[], userId);
}

export async function searchProfiles(query: string, currentUserId: string): Promise<PostAuthor[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,display_name,avatar_url,avatar_emoji,verified")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .neq("id", currentUserId)
    .order("username")
    .limit(20);
  if (error) throw error;
  return (data ?? []) as PostAuthor[];
}

export async function fetchSuggestedProfiles(currentUserId: string, limit = 5): Promise<PostAuthor[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,display_name,avatar_url,avatar_emoji,verified")
    .neq("id", currentUserId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as PostAuthor[];
}
