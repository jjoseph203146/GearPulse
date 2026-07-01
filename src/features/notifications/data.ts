import { supabase } from "@/lib/supabase";
import type { AppNotification } from "@/types";

const NOTIF_SELECT = `
  id, type, content, read, created_at, post_id, space_id,
  actor:profiles!notifications_actor_id_fkey(id,username,display_name,avatar_url,avatar_emoji,verified),
  post:posts(image_url)
`;

type RawNotification = Omit<AppNotification, "actor" | "post_image_url"> & {
  actor: AppNotification["actor"];
  post: { image_url: string | null } | null;
};

function mapRow(row: RawNotification): AppNotification {
  return {
    id: row.id,
    type: row.type,
    content: row.content,
    read: row.read,
    created_at: row.created_at,
    post_id: row.post_id,
    space_id: row.space_id,
    actor: row.actor,
    post_image_url: row.post?.image_url ?? null,
  };
}

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIF_SELECT)
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return ((data ?? []) as unknown as RawNotification[]).map(mapRow);
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_id", userId)
    .eq("read", false);
  if (error) throw error;
}

/** Subscribes to new notifications for a user; returns an unsubscribe function. */
export function subscribeToNotifications(userId: string, onInsert: (row: AppNotification) => void) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_id=eq.${userId}` },
      async (payload) => {
        const { data } = await supabase
          .from("notifications")
          .select(NOTIF_SELECT)
          .eq("id", payload.new.id)
          .single();
        if (data) onInsert(mapRow(data as unknown as RawNotification));
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
