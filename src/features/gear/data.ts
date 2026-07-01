import { supabase } from "@/lib/supabase";
import type { GearCategory, GearDetail, GearListItem, GearReview, PostAuthor, RigItem } from "@/types";

type RawGearRow = {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
  category: { id: string; label: string; emoji: string } | null;
};

async function withOwnerCounts(rows: RawGearRow[]): Promise<GearListItem[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const { data: rigRows } = await supabase.from("rig_items").select("gear_id").in("gear_id", ids);
  const counts = new Map<string, number>();
  for (const r of rigRows ?? []) {
    if (!r.gear_id) continue;
    counts.set(r.gear_id, (counts.get(r.gear_id) ?? 0) + 1);
  }
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    brand: r.brand,
    category: r.category?.label ?? "",
    categoryId: r.category?.id ?? "",
    categoryEmoji: r.category?.emoji ?? "🎵",
    image: r.image_url ?? "",
    ownersCount: counts.get(r.id) ?? 0,
  }));
}

export async function fetchGearCategories(): Promise<GearCategory[]> {
  const { data, error } = await supabase.from("gear_categories").select("id,label,emoji").order("label");
  if (error) throw error;
  return data ?? [];
}

export async function searchGear(query: string, categoryId: string): Promise<GearListItem[]> {
  let q = supabase.from("gear").select("id,name,brand,image_url,category:gear_categories(id,label,emoji)");
  if (categoryId !== "all") q = q.eq("category_id", categoryId);
  if (query.trim()) q = q.or(`name.ilike.%${query.trim()}%,brand.ilike.%${query.trim()}%`);
  const { data, error } = await q.order("name").limit(50);
  if (error) throw error;
  return withOwnerCounts((data ?? []) as unknown as RawGearRow[]);
}

export async function fetchPopularGear(limit = 5): Promise<GearListItem[]> {
  const [{ data, error }, { data: tagRows }] = await Promise.all([
    supabase.from("gear").select("id,name,brand,image_url,category:gear_categories(id,label,emoji)"),
    supabase.from("post_gear").select("gear_id").not("gear_id", "is", null),
  ]);
  if (error) throw error;

  const usage = new Map<string, number>();
  for (const r of tagRows ?? []) {
    if (!r.gear_id) continue;
    usage.set(r.gear_id, (usage.get(r.gear_id) ?? 0) + 1);
  }

  const rows = ((data ?? []) as unknown as RawGearRow[]).sort((a, b) => {
    const diff = (usage.get(b.id) ?? 0) - (usage.get(a.id) ?? 0);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });

  return withOwnerCounts(rows.slice(0, limit));
}

export async function fetchGearByIds(ids: string[]): Promise<GearListItem[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("gear")
    .select("id,name,brand,image_url,category:gear_categories(id,label,emoji)")
    .in("id", ids);
  if (error) throw error;
  return withOwnerCounts((data ?? []) as unknown as RawGearRow[]);
}

export async function fetchGearById(id: string): Promise<GearDetail | null> {
  const { data: gear, error } = await supabase
    .from("gear")
    .select("id,name,brand,image_url,description,specs,category:gear_categories(id,label,emoji)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!gear) return null;

  const [{ count: ownersCount }, { count: postsCount }, { data: relatedRows }, { data: reviewRows }] = await Promise.all([
    supabase.from("rig_items").select("id", { count: "exact", head: true }).eq("gear_id", id),
    supabase.from("post_gear").select("id", { count: "exact", head: true }).eq("gear_id", id),
    supabase
      .from("gear_related")
      .select("related:gear!gear_related_related_gear_id_fkey(id,name,brand,image_url,category:gear_categories(id,label,emoji))")
      .eq("gear_id", id),
    supabase.from("reviews").select("rating").eq("gear_id", id),
  ]);

  const related = await withOwnerCounts(
    ((relatedRows ?? []) as unknown as { related: RawGearRow }[]).map((r) => r.related).filter(Boolean),
  );

  const ratings = (reviewRows ?? []).map((r) => r.rating);
  const rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const g = gear as unknown as RawGearRow & { description: string; specs: { label: string; value: string }[] };

  return {
    id: g.id,
    name: g.name,
    brand: g.brand,
    category: g.category?.label ?? "",
    categoryId: g.category?.id ?? "",
    categoryEmoji: g.category?.emoji ?? "🎵",
    image: g.image_url ?? "",
    ownersCount: ownersCount ?? 0,
    description: g.description ?? "",
    specs: g.specs ?? [],
    rating: Math.round(rating * 10) / 10,
    reviewsCount: ratings.length,
    postsCount: postsCount ?? 0,
    related,
  };
}

/** Distinct authors who've tagged this gear in a post — "creators by gear ecosystem". */
export async function fetchGearCreators(gearId: string, limit = 10): Promise<PostAuthor[]> {
  const { data: tagRows, error: tagError } = await supabase.from("post_gear").select("post_id").eq("gear_id", gearId);
  if (tagError) throw tagError;
  const postIds = (tagRows ?? []).map((r) => r.post_id);
  if (postIds.length === 0) return [];

  const { data: postRows, error } = await supabase.from("posts").select("author_id").in("id", postIds);
  if (error) throw error;
  const authorIds = [...new Set((postRows ?? []).map((p) => p.author_id))].slice(0, limit);
  if (authorIds.length === 0) return [];

  const { data: authors, error: authorError } = await supabase
    .from("profiles")
    .select("id,username,display_name,avatar_url,avatar_emoji,verified")
    .in("id", authorIds);
  if (authorError) throw authorError;
  return (authors ?? []) as PostAuthor[];
}

export async function fetchReviews(gearId: string): Promise<GearReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, text, created_at, author:profiles!reviews_user_id_fkey(id,username,display_name,avatar_url,avatar_emoji,verified)")
    .eq("gear_id", gearId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as GearReview[];
}

export async function submitReview(gearId: string, userId: string, rating: number, text: string) {
  const { error } = await supabase
    .from("reviews")
    .upsert({ gear_id: gearId, user_id: userId, rating, text }, { onConflict: "gear_id,user_id" });
  if (error) throw error;
}

export async function addGearToRig(userId: string, gearId: string) {
  const { error } = await supabase
    .from("rig_items")
    .upsert({ user_id: userId, gear_id: gearId }, { onConflict: "user_id,gear_id", ignoreDuplicates: true });
  if (error) throw error;
}

export async function isGearInRig(userId: string, gearId: string): Promise<boolean> {
  const { count } = await supabase
    .from("rig_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("gear_id", gearId);
  return (count ?? 0) > 0;
}

export async function submitCustomGear(
  userId: string,
  input: { name: string; brand: string; categoryId: string; mode: "profile" | "catalog" },
) {
  const { data: customGear, error } = await supabase
    .from("custom_gear")
    .insert({
      submitted_by: userId,
      name: input.name,
      brand: input.brand,
      category_id: input.categoryId || null,
      mode: input.mode,
    })
    .select()
    .single();
  if (error) throw error;

  const { error: rigError } = await supabase
    .from("rig_items")
    .insert({ user_id: userId, custom_gear_id: customGear.id });
  if (rigError) throw rigError;
}

export async function fetchRig(userId: string): Promise<RigItem[]> {
  const { data, error } = await supabase
    .from("rig_items")
    .select(
      "id, created_at, gear:gear(id,name,image_url,category:gear_categories(id,label,emoji)), custom_gear:custom_gear(id,name,brand,status)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return ((data ?? []) as unknown as {
    id: string;
    created_at: string;
    gear: { id: string; name: string; image_url: string | null; category: { label: string; emoji: string } | null } | null;
    custom_gear: { id: string; name: string; brand: string | null; status: string } | null;
  }[]).map((row) => {
    const year = new Date(row.created_at).getFullYear().toString();
    if (row.gear) {
      return {
        id: row.id,
        refId: row.gear.id,
        name: row.gear.name,
        type: row.gear.category?.label ?? "",
        emoji: row.gear.category?.emoji ?? "🎵",
        year,
        image: row.gear.image_url ?? "",
        isCustom: false,
      };
    }
    return {
      id: row.id,
      refId: null,
      name: row.custom_gear?.name ?? "Custom gear",
      type: row.custom_gear?.status === "pending" ? "Pending review" : "Custom",
      emoji: "🛠️",
      year,
      image: "",
      isCustom: true,
    };
  });
}
