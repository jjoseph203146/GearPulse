import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";

const MESSAGES = [
  { id: 1, mine: false, text: "Hey! I saw your studio setup post. It looks amazing!", time: "10:30 AM" },
  { id: 2, mine: true, text: "Thanks! Took me about 6 months to get everything right", time: "10:32 AM" },
  { id: 3, mine: false, text: "Which interface are you using? I'm looking to upgrade mine", time: "10:33 AM" },
  { id: 4, mine: true, text: "I'm using the Focusrite Scarlett 18i20. It's been rock solid for me", time: "10:35 AM" },
  { id: 5, mine: false, text: "Thanks! The pedalboard setup looks amazing", time: "10:36 AM" },
];

export function Chat() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen max-w-screen-md mx-auto">
      <div className="flex-none flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/messages")} />
          <div className="gp-grad w-10 h-10 rounded-full flex items-center justify-center text-xl">🎸</div>
          <div>
            <div className="text-[15px] font-bold">Sarah Chen</div>
            <div className="text-xs text-[#71717a]">Active now</div>
          </div>
        </div>
        <MaterialIcon name="more_vert" size={22} color="#a1a1aa" className="cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-[18px] flex flex-col gap-3.5">
        {MESSAGES.map((m) => (
          <div key={m.id} className={`max-w-[75%] ${m.mine ? "self-end" : "self-start"}`}>
            <div
              className={`rounded-[18px] px-3.5 py-[11px] text-sm leading-[1.4] ${m.mine ? "gp-grad text-white" : "bg-[#27272a] text-[#f4f4f5]"}`}
            >
              {m.text}
            </div>
            <div className={`text-[11px] text-[#71717a] mt-1 ${m.mine ? "text-right" : ""}`}>{m.time}</div>
          </div>
        ))}
      </div>
      <div className="flex-none flex items-center gap-2.5 px-4 pt-3.5 pb-[22px] border-t border-[#27272a] bg-[#18181b]">
        <MaterialIcon name="image" size={24} color="#a1a1aa" className="cursor-pointer" />
        <input
          placeholder="Type a message..."
          className="flex-1 h-11 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] px-4 text-sm outline-none placeholder:text-[#71717a]"
        />
        <button className="gp-grad w-11 h-11 rounded-[11px] border-none flex items-center justify-center cursor-pointer">
          <MaterialIcon name="send" size={21} color="#fff" filled />
        </button>
      </div>
    </div>
  );
}
