import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchConversationParticipant,
  fetchMessages,
  markConversationRead,
  sendMessage,
  subscribeToMessages,
} from "./data";
import type { ChatMessage, PostAuthor } from "@/types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const [other, setOther] = useState<PostAuthor | null>(null);
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId || !user) return;
    fetchConversationParticipant(chatId, user.id).then(setOther);
    fetchMessages(chatId).then(setMessages);
    markConversationRead(chatId, user.id);

    return subscribeToMessages(chatId, (row) => {
      setMessages((prev) => {
        if (prev?.some((m) => m.id === row.id)) return prev;
        return [...(prev ?? []), row];
      });
      if (row.sender_id !== user.id) markConversationRead(chatId, user.id);
    });
  }, [chatId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || !chatId || !user || sending) return;
    setDraft("");
    setSending(true);
    try {
      const row = await sendMessage(chatId, user.id, content);
      setMessages((prev) => [...(prev ?? []), row]);
    } finally {
      setSending(false);
    }
  }

  if (!other || messages === null) return <div className="min-h-screen bg-[#09090b]" />;

  return (
    <div className="flex flex-col h-screen max-w-screen-md mx-auto">
      <div className="flex-none flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/messages")} />
          <div className="gp-grad w-10 h-10 rounded-full flex items-center justify-center text-xl overflow-hidden">
            {other.avatar_url ? (
              <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              other.avatar_emoji ?? "🎵"
            )}
          </div>
          <div>
            <div className="flex items-center gap-[5px]">
              <span className="text-[15px] font-bold">{other.display_name}</span>
              {other.verified && <MaterialIcon name="verified" size={14} color="#3b82f6" filled />}
            </div>
            <div className="text-xs text-[#71717a]">@{other.username}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-[18px] flex flex-col gap-3.5">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-sm text-[#71717a]">No messages yet. Say hi to {other.display_name.split(" ")[0]} 👋</p>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`max-w-[75%] ${mine ? "self-end" : "self-start"}`}>
                <div
                  className={`rounded-[18px] px-3.5 py-[11px] text-sm leading-[1.4] ${mine ? "gp-grad text-white" : "bg-[#27272a] text-[#f4f4f5]"}`}
                >
                  {m.content}
                </div>
                <div className={`text-[11px] text-[#71717a] mt-1 ${mine ? "text-right" : ""}`}>{formatTime(m.created_at)}</div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex-none flex items-center gap-2.5 px-4 pt-3.5 pb-[22px] border-t border-[#27272a] bg-[#18181b]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
          className="flex-1 h-11 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] px-4 text-sm outline-none placeholder:text-[#71717a]"
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="gp-grad w-11 h-11 rounded-[11px] border-none flex items-center justify-center cursor-pointer disabled:opacity-40"
        >
          <MaterialIcon name="send" size={21} color="#fff" filled />
        </button>
      </div>
    </div>
  );
}
