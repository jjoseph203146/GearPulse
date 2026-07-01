import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { chatsData } from "./data";
import { EmptyMessages } from "./EmptyMessages";

export function Messages() {
  const navigate = useNavigate();

  if (chatsData.length === 0) return <EmptyMessages />;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] p-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <h1 className="text-2xl font-extrabold tracking-[-.02em] mb-4">Messages</h1>
        <div className="relative">
          <MaterialIcon name="search" size={21} color="#71717a" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search messages"
            className="w-full h-12 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] pl-11 pr-4 text-[15px] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>
      <div className="flex flex-col">
        {chatsData.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/app/messages/${c.id}`)}
            className="flex items-start gap-3.5 p-4 border-b border-[#27272a] cursor-pointer"
          >
            <div className="relative flex-none">
              <div className="gp-grad w-[54px] h-[54px] rounded-full flex items-center justify-center text-[26px]">
                {c.avatar}
              </div>
              {c.unread && (
                <span className="absolute top-0 right-0 w-[15px] h-[15px] rounded-full bg-[#a855f7] border-[2.5px] border-[#09090b]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-[3px]">
                <div className="flex items-center gap-[5px]">
                  <span className="text-[15px] font-bold" style={{ color: c.unread ? "#fff" : "#d4d4d8" }}>
                    {c.name}
                  </span>
                  {c.verified && <MaterialIcon name="verified" size={15} color="#3b82f6" filled />}
                </div>
                <span className="text-[11.5px] text-[#71717a] whitespace-nowrap flex-none pl-2">{c.time}</span>
              </div>
              <div
                className="text-[13.5px] whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ color: c.unread ? "#d4d4d8" : "#71717a" }}
              >
                {c.lastMessage}
              </div>
            </div>
            <MaterialIcon name="more_horiz" size={20} color="#a1a1aa" className="flex-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
