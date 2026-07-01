import { supabase } from "@/lib/supabase";
import type { SpaceListItem } from "@/types";

type RawSpace = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string | null;
  image_url: string | null;
  is_public: boolean;
  created_by: string | null;
};

async function withMembership(rows: RawSpace[], userId: string): Promise<SpaceListItem[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const { data: members } = await supabase.from("space_members").select("space_id,user_id").in("space_id", ids);
  const counts = new Map<string, number>();
  const joined = new Set<string>();
  for (const m of members ?? []) {
    counts.set(m.space_id, (counts.get(m.space_id) ?? 0) + 1);
    if (m.user_id === userId) joined.add(m.space_id);
  }
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    description: r.description,
    gradient: r.gradient,
    image: r.image_url,
    isPublic: r.is_public,
    isMine: r.created_by === userId,
    joined: joined.has(r.id),
    memberCount: counts.get(r.id) ?? 0,
  }));
}

export async function fetchSpaces(userId: string): Promise<SpaceListItem[]> {
  const { data, error } = await supabase
    .from("spaces")
    .select("id,name,emoji,description,gradient,image_url,is_public,created_by")
    .order("created_by", { ascending: true, nullsFirst: true })
    .order("name");
  if (error) throw error;
  return withMembership((data ?? []) as RawSpace[], userId);
}

export async function fetchSpaceById(spaceId: string, userId: string): Promise<SpaceListItem | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("id,name,emoji,description,gradient,image_url,is_public,created_by")
    .eq("id", spaceId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [space] = await withMembership([data as RawSpace], userId);
  return space;
}

export async function joinSpace(spaceId: string, userId: string) {
  const { error } = await supabase
    .from("space_members")
    .upsert({ space_id: spaceId, user_id: userId }, { onConflict: "space_id,user_id", ignoreDuplicates: true });
  if (error) throw error;
}

export async function leaveSpace(spaceId: string, userId: string) {
  const { error } = await supabase.from("space_members").delete().eq("space_id", spaceId).eq("user_id", userId);
  if (error) throw error;
}

export async function createSpace(name: string, isPublic: boolean): Promise<string> {
  const { data, error } = await supabase.rpc("create_user_space", { space_name: name, space_is_public: isPublic });
  if (error) throw error;
  return data as string;
}
