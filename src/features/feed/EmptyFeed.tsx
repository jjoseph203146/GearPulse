import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { searchCreatorsData } from "@/features/search/data";

export function EmptyFeed() {
  const navigate = useNavigate();

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-2.5">
          <div className="gp-grad w-[34px] h-[34px] rounded-[10px] flex items-center justify-center">
            <MaterialIcon name="podcasts" size={21} color="#fff" filled />
          </div>
          <span className="gp-word font-extrabold text-[21px] tracking-[-.02em]">GearPulse</span>
        </div>
        <div className="flex gap-1.5">
          <div
            onClick={() => navigate("/app/notifications")}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <MaterialIcon name="notifications" size={24} color="#a1a1aa" />
          </div>
          <div
            onClick={() => navigate("/app/messages")}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <MaterialIcon name="chat_bubble" size={24} color="#a1a1aa" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-center px-8 pt-14 pb-2">
        <div className="w-[84px] h-[84px] rounded-[24px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
          <MaterialIcon name="dynamic_feed" size={40} color="#52525b" />
        </div>
        <h2 className="text-[21px] font-extrabold tracking-[-.01em]">Your feed is quiet</h2>
        <p className="text-sm text-[#a1a1aa] mt-2 leading-[1.5] max-w-[280px]" style={{ textWrap: "balance" }}>
          Follow creators and join spaces to start seeing posts, gear drops, and discussions here.
        </p>
        <button
          onClick={() => navigate("/app/spaces")}
          className="gp-grad mt-[22px] h-12 px-[26px] rounded-[14px] border-none text-white text-[15px] font-bold cursor-pointer font-sans"
        >
          Discover Spaces
        </button>
      </div>
      <div className="px-4 pt-8 pb-6">
        <div className="text-[11.5px] font-bold text-[#71717a] tracking-[.06em] mb-3">SUGGESTED CREATORS</div>
        <div className="flex flex-col gap-3">
          {searchCreatorsData.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)]"
            >
              <div className="flex items-center gap-3">
                <div className="gp-grad w-11 h-11 rounded-full flex items-center justify-center text-xl">
                  {c.avatar}
                </div>
                <div>
                  <div className="text-[14.5px] font-bold">{c.name}</div>
                  <div className="text-xs text-[#71717a]">{c.followers} followers</div>
                </div>
              </div>
              <button className="gp-grad h-[34px] px-4 rounded-[10px] border-none text-white text-[13px] font-bold cursor-pointer font-sans">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
