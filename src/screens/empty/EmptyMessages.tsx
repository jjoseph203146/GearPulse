import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";

export function EmptyMessages() {
  const navigate = useNavigate();

  return (
    <div className="gpfade flex flex-col min-h-screen max-w-screen-md mx-auto">
      <div className="px-4 py-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <h1 className="text-2xl font-extrabold tracking-[-.02em] mb-4">Messages</h1>
        <div className="relative">
          <MaterialIcon name="search" size={21} color="#71717a" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search messages"
            className="w-full h-12 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] pl-11 pr-4 text-[15px] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-[84px] h-[84px] rounded-[24px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
          <MaterialIcon name="forum" size={40} color="#52525b" />
        </div>
        <h2 className="text-xl font-extrabold">No messages yet</h2>
        <p className="text-sm text-[#a1a1aa] mt-2 leading-[1.5] max-w-[260px]" style={{ textWrap: "balance" }}>
          When you connect with creators and brands, your conversations will show up here.
        </p>
        <button
          onClick={() => navigate("/app/search")}
          className="gp-grad mt-[22px] h-12 px-[26px] rounded-[14px] border-none text-white text-[15px] font-bold cursor-pointer font-sans"
        >
          Find Creators
        </button>
      </div>
    </div>
  );
}
