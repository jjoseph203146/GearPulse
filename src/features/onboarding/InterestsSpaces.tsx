import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/features/onboarding/OnboardingHeader";
import { interestsData } from "./data";
import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/lib/utils";

export function InterestsSpaces() {
  const navigate = useNavigate();
  const { interests, toggleInterest } = useAppState();
  const n = interests.length;

  return (
    <div className="min-h-screen p-6">
      <OnboardingHeader back="/onboarding/instruments" step={3} skipTo="/onboarding/brands" />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em] leading-[1.15]">Customize your GearPulse feed</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-6">Join communities that match your interests</p>
      <div className="flex flex-col gap-3">
        {interestsData.map((sp) => {
          const sel = interests.includes(sp.id);
          return (
            <div
              key={sp.id}
              onClick={() => toggleInterest(sp.id)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer",
                sel ? "border-[#a855f7] bg-[rgba(168,85,247,.1)]" : "border-[#27272a] bg-[rgba(24,24,27,.5)]",
              )}
            >
              <div
                className={cn(
                  "w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-[22px] flex-none",
                  sel ? "bg-[rgba(168,85,247,.2)]" : "bg-[#27272a]",
                )}
              >
                {sp.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold">{sp.name}</div>
                <div className="text-[13px] text-[#a1a1aa] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {sp.desc}
                </div>
                <div className="text-[11.5px] text-[#71717a] mt-[3px]">{sp.members} members</div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate("/onboarding/brands")}
        className="gp-grad mt-7 w-full h-[54px] border-none rounded-[14px] text-white text-base font-bold cursor-pointer font-sans"
      >
        {n > 0 ? `Continue (${n} selected)` : "Continue"}
      </button>
    </div>
  );
}
