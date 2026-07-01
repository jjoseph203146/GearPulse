import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";

interface OnboardingHeaderProps {
  back: string;
  step: number;
  skipTo?: string;
}

export function OnboardingHeader({ back, step, skipTo }: OnboardingHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-7">
      <MaterialIcon name="arrow_back" size={26} color="#a1a1aa" onClick={() => navigate(back)} />
      <div className="flex items-center gap-4">
        {skipTo && (
          <span
            onClick={() => navigate(skipTo)}
            className="text-[13px] font-semibold text-[#60a5fa] cursor-pointer"
          >
            Skip
          </span>
        )}
        <span className="text-[13px] text-[#71717a]">Step {step} of 5</span>
      </div>
    </div>
  );
}
