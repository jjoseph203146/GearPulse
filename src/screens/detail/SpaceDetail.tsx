import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { spaceFeedData } from "@/data/appData";
import { useAppState } from "@/state/AppState";
import { cn } from "@/lib/utils";

const TABS = ["Posts", "Gear", "News", "Creators"];

export function SpaceDetail() {
  const navigate = useNavigate();
  const { spaceTab, setSpaceTab } = useAppState();

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/spaces")} />
        <div className="flex gap-3.5">
          <MaterialIcon name="notifications" size={22} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/notifications")} />
          <MaterialIcon name="share" size={22} color="#a1a1aa" className="cursor-pointer" />
        </div>
      </div>
      <div
        className="relative h-[150px]"
        style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)" }}
      >
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&q=80"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <div className="px-4 -mt-12 relative">
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-[22px]">
          <h1 className="text-[23px] font-extrabold tracking-[-.02em]">Keyboard Space</h1>
          <div className="flex items-center gap-[7px] text-[#a1a1aa] my-2.5">
            <MaterialIcon name="group" size={18} />
            <span className="text-sm">12.5k members</span>
          </div>
          <p className="text-sm leading-[1.55] text-[#d4d4d8]">
            A community for keyboard enthusiasts, stage performers, and synth lovers. Share your setups, ask
            questions, and discover new gear.
          </p>
          <button className="gp-grad mt-4 w-full h-12 rounded-xl border-none text-white text-[15px] font-bold cursor-pointer font-sans">
            Join Space
          </button>
        </div>
        <div className="flex gap-1.5 bg-[#18181b] border border-[#27272a] rounded-xl p-[5px] mt-[22px]">
          {TABS.map((label) => {
            const active = spaceTab === label;
            return (
              <div
                key={label}
                onClick={() => setSpaceTab(label)}
                className={cn(
                  "flex-1 text-center py-2 px-1 rounded-lg text-[13.5px] font-semibold cursor-pointer",
                  active ? "text-[#fafafa] bg-[#27272a]" : "text-[#71717a] bg-transparent",
                )}
              >
                {label}
              </div>
            );
          })}
        </div>
        <div className="py-[18px] pb-6">
          {spaceTab === "Posts" && (
            <div className="flex flex-col gap-4">
              {spaceFeedData.map((post) => (
                <div key={post.id} className="bg-[#18181b] rounded-2xl border border-[#27272a] p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="gp-grad w-10 h-10 rounded-full flex items-center justify-center text-xl flex-none">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold">{post.author}</div>
                      <div className="text-[11.5px] text-[#71717a]">{post.time}</div>
                    </div>
                  </div>
                  <p className="text-[14.5px] leading-[1.5] text-[#f4f4f5]">{post.content}</p>
                  {post.image && (
                    <div className="w-full rounded-xl overflow-hidden mt-3">
                      <img src={post.image} alt="" className="w-full block" loading="lazy" />
                    </div>
                  )}
                  <div className="flex gap-4 mt-3 text-[#a1a1aa] text-[13.5px]">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {spaceTab === "Gear" && (
            <div className="text-center py-12 text-[#71717a] text-sm">Gear recommendations coming soon</div>
          )}
          {spaceTab === "News" && (
            <div className="text-center py-12 text-[#71717a] text-sm">Latest news coming soon</div>
          )}
          {spaceTab === "Creators" && (
            <div className="text-center py-12 text-[#71717a] text-sm">Featured creators coming soon</div>
          )}
        </div>
      </div>
    </div>
  );
}
