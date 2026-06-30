import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { accountTypes } from "@/data/appData";
import { useAppState } from "@/state/AppState";
import { cn } from "@/lib/utils";

export function AccountType() {
  const navigate = useNavigate();
  const { types, setTypes } = useAppState();

  return (
    <div className="min-h-screen p-6">
      <OnboardingHeader back="/" step={1} />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em] leading-[1.15]">What brings you to GearPulse?</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-6">Choose the option that best describes you</p>
      <div className="flex flex-col gap-3">
        {accountTypes.map((t) => {
          const sel = types.includes(t.id);
          return (
            <div
              key={t.id}
              onClick={() => setTypes(sel ? [] : [t.id])}
              className={cn(
                "flex items-start gap-4 p-[18px] rounded-2xl border-2 cursor-pointer transition-all",
                sel ? "border-[#a855f7] bg-[rgba(168,85,247,.1)]" : "border-[#27272a] bg-[rgba(24,24,27,.5)]",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-[13px] flex items-center justify-center text-2xl flex-none",
                  sel ? "bg-[rgba(168,85,247,.2)]" : "bg-[#27272a]",
                )}
              >
                {t.emoji}
              </div>
              <div className="flex-1">
                <div className="text-[17px] font-bold">{t.name}</div>
                <div className="text-[13px] text-[#a1a1aa] mt-0.5">{t.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => navigate("/onboarding/instruments")}
        className="gp-grad mt-7 w-full h-[54px] border-none rounded-[14px] text-white text-base font-bold cursor-pointer font-sans"
      >
        Continue
      </button>
    </div>
  );
}
