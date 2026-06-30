import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { instrumentsData } from "@/data/appData";
import { useAppState } from "@/state/AppState";
import { cn } from "@/lib/utils";

export function Instruments() {
  const navigate = useNavigate();
  const { instruments, toggleInstrument } = useAppState();
  const n = instruments.length;

  return (
    <div className="min-h-screen p-6">
      <OnboardingHeader back="/onboarding/type" step={2} skipTo="/onboarding/spaces" />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em]">What do you play?</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-6">Select all that apply</p>
      <div className="grid grid-cols-2 gap-3">
        {instrumentsData.map((i) => {
          const sel = instruments.includes(i.id);
          return (
            <div
              key={i.id}
              onClick={() => toggleInstrument(i.id)}
              className={cn(
                "flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border-2 cursor-pointer text-center",
                sel ? "border-[#a855f7] bg-[rgba(168,85,247,.1)]" : "border-[#27272a] bg-[rgba(24,24,27,.5)]",
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-[28px]",
                  sel ? "bg-[rgba(168,85,247,.2)]" : "bg-[#27272a]",
                )}
              >
                {i.emoji}
              </div>
              <span className="text-[13px] font-semibold">{i.name}</span>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate("/onboarding/spaces")}
        className="gp-grad mt-7 w-full h-[54px] border-none rounded-[14px] text-white text-base font-bold cursor-pointer font-sans"
      >
        {n > 0 ? `Continue (${n} selected)` : "Continue"}
      </button>
    </div>
  );
}
