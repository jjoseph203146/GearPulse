import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/features/onboarding/OnboardingHeader";
import { MaterialIcon } from "@/components/MaterialIcon";
import { brandsData } from "./data";
import { useAppState } from "@/hooks/useAppState";

export function FollowBrands() {
  const navigate = useNavigate();
  const { follows, toggleFollow } = useAppState();
  const n = follows.length;

  return (
    <div className="min-h-screen p-6">
      <OnboardingHeader back="/onboarding/spaces" step={4} />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em]">Follow your favorite brands</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-6">Stay updated with the latest gear releases</p>
      <div className="flex flex-col gap-3">
        {brandsData.map((b) => {
          const f = follows.includes(b.id);
          return (
            <div
              key={b.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[rgba(24,24,27,.5)] border border-[#27272a]"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center text-2xl flex-none border border-[#3f3f46]"
                  style={{ background: "linear-gradient(135deg,#27272a,#18181b)" }}
                >
                  {b.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-bold">{b.name}</span>
                    <MaterialIcon name="verified" size={16} color="#3b82f6" filled />
                  </div>
                  <div className="text-[12.5px] text-[#71717a] mt-px">Verified Brand</div>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(b.id)}
                className="h-[38px] px-[18px] rounded-[10px] text-[13.5px] font-bold cursor-pointer font-sans"
                style={{
                  border: `1px solid ${f ? "#3f3f46" : "#9333ea"}`,
                  background: f ? "transparent" : "#9333ea",
                  color: f ? "#a1a1aa" : "#fff",
                }}
              >
                {f ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate("/onboarding/profile")}
        className="gp-grad mt-7 w-full h-[54px] border-none rounded-[14px] text-white text-base font-bold cursor-pointer font-sans"
      >
        {n > 0 ? `Continue (${n} following)` : "Skip for now"}
      </button>
    </div>
  );
}
