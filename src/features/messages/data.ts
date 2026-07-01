import { supabase } from "@/lib/supabase";
import type { ChatMessage, ConversationListItem, PostAuthor } from "@/types";

const PARTICIPANT_SELECT = "id,username,display_name,avatar_url,avatar_emoji,verified";

export async function fetchConversations(userId: string): Promise<ConversationListItem[]> {
  const { data: myRows, error: myError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);
  if (myError) throw myError;
  const conversationIds = (myRows ?? []).map((r) => r.conversation_id);
  if (conversationIds.length === 0) return [];

  const [{ data: otherRows, error: otherError }, { data: messageRows, error: messagesError }] = await Promise.all([
    supabase
      .from("conversation_participants")
      .select(`conversation_id, profile:profiles!conversation_participants_user_id_fkey(${PARTICIPANT_SELECT})`)
      .in("conversation_id", conversationIds)
      .neq("user_id", userId),
    supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at, read_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false }),
  ]);
  if (otherError) throw otherError;
  if (messagesError) throw messagesError;

  const otherByConversation = new Map<string, PostAuthor>();
  for (const row of (otherRows ?? []) as unknown as { conversation_id: string; profile: PostAuthor }[]) {
    otherByConversation.set(row.conversation_id, row.profile);
  }

  const lastMessageByConversation = new Map<string, ChatMessage>();
  for (const m of (messageRows ?? []) as ChatMessage[]) {
    if (!lastMessageByConversation.has(m.conversation_id)) lastMessageByConversation.set(m.conversation_id, m);
  }

  return conversationIds
    .map((id) => {
      const other = otherByConversation.get(id);
      const last = lastMessageByConversation.get(id);
      if (!other) return null;
      return {
        id,
        other,
        lastMessage: last?.content ?? null,
        lastMessageAt: last?.created_at ?? null,
        unread: !!last && last.sender_id !== userId && !last.read_at,
      } satisfies ConversationListItem;
    })
    .filter((c): c is ConversationListItem => c !== null)
    .sort((a, b) => +new Date(b.lastMessageAt ?? 0) - +new Date(a.lastMessageAt ?? 0));
}

export async function fetchConversationParticipant(
  conversationId: string,
  userId: string,
): Promise<PostAuthor | null> {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select(`profile:profiles!conversation_participants_user_id_fkey(${PARTICIPANT_SELECT})`)
    .eq("conversation_id", conversationId)
    .neq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as { profile: PostAuthor } | null)?.profile ?? null;
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, content, created_at, read_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select("id, conversation_id, sender_id, content, created_at, read_at")
    .single();
  if (error) throw error;
  return data as ChatMessage;
}

export async function markConversationRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .is("read_at", null);
  if (error) throw error;
}

/** Finds or creates a 1:1 conversation with the given user via the start_conversation() RPC. */
export async function startConversation(otherUserId: string): Promise<string> {
  const { data, error } = await supabase.rpc("start_conversation", { other_user: otherUserId });
  if (error) throw error;
  return data as string;
}

/** Subscribes to new messages in a conversation; returns an unsubscribe function. */
export function subscribeToMessages(conversationId: string, onInsert: (row: ChatMessage) => void) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert(payload.new as ChatMessage),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
