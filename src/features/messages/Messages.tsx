import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { ChatRowSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { fetchConversations } from "./data";
import { EmptyMessages } from "./EmptyMessages";
import type { ConversationListItem } from "@/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationListItem[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchConversations(user.id).then(setConversations);
  }, [user]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      conversations?.filter(
        (c) => !q || c.other.display_name.toLowerCase().includes(q) || c.other.username.toLowerCase().includes(q),
      ) ?? null,
    [conversations, q],
  );

  if (conversations !== null && conversations.length === 0) return <EmptyMessages />;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] p-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <h1 className="text-2xl font-extrabold tracking-[-.02em] mb-4">Messages</h1>
        <div className="relative">
          <MaterialIcon name="search" size={21} color="#71717a" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages"
            className="w-full h-12 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] pl-11 pr-4 text-[15px] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filtered === null ? (
          <>
            <ChatRowSkeleton />
            <ChatRowSkeleton />
            <ChatRowSkeleton />
          </>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/app/messages/${c.id}`)}
              className="flex items-start gap-3.5 p-4 border-b border-[#27272a] cursor-pointer"
            >
              <div className="relative flex-none">
                <div className="gp-grad w-[54px] h-[54px] rounded-full flex items-center justify-center text-[26px] overflow-hidden">
                  {c.other.avatar_url ? (
                    <img src={c.other.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    c.other.avatar_emoji ?? "🎵"
                  )}
                </div>
                {c.unread && (
                  <span className="absolute top-0 right-0 w-[15px] h-[15px] rounded-full bg-[#3b82f6] border-[2.5px] border-[#09090b]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[3px]">
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[15px] font-bold" style={{ color: c.unread ? "#fff" : "#d4d4d8" }}>
                      {c.other.display_name}
                    </span>
                    {c.other.verified && <MaterialIcon name="verified" size={15} color="#3b82f6" filled />}
                  </div>
                  {c.lastMessageAt && (
                    <span className="text-[11.5px] text-[#71717a] whitespace-nowrap flex-none pl-2">
                      {timeAgo(c.lastMessageAt)}
                    </span>
                  )}
                </div>
                <div
                  className="text-[13.5px] whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: c.unread ? "#d4d4d8" : "#71717a" }}
                >
                  {c.lastMessage ?? "Say hi 👋"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
