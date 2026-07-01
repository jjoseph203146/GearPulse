import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import logo from "@/assets/logo.png";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-6"
      style={{ background: "linear-gradient(180deg,#09090b,#0c0a14 45%,#09090b)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="absolute -inset-[30px] bg-[rgba(59,130,246,.22)] blur-[50px] rounded-full" />
          <div
            className="relative w-[108px] h-[108px] rounded-[30px] overflow-hidden"
            style={{ boxShadow: "0 20px 50px rgba(37,99,235,.45)" }}
          >
            <img src={logo} alt="GearPulse" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="gp-word text-[46px] font-extrabold tracking-[-.02em]">GearPulse</h1>
        <p className="mt-3.5 text-[22px] font-bold text-[#f4f4f5] text-center" style={{ textWrap: "balance" }}>
          The future of music gear and creators
        </p>
        <p className="mt-3 text-[15px] leading-[1.55] text-[#a1a1aa] text-center max-w-[300px]">
          Discover new equipment, connect with musicians, follow brands, and stay ahead of the industry.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[320px] mt-8">
          <div className="flex items-center gap-3 bg-[rgba(24,24,27,.5)] border border-[#27272a] rounded-[14px] p-[15px]">
            <MaterialIcon name="music_note" size={21} color="#60a5fa" />
            <span className="text-sm text-[#d4d4d8]">Connect with music professionals</span>
          </div>
          <div className="flex items-center gap-3 bg-[rgba(24,24,27,.5)] border border-[#27272a] rounded-[14px] p-[15px]">
            <MaterialIcon name="auto_awesome" size={21} color="#38bdf8" />
            <span className="text-sm text-[#d4d4d8]">Discover the latest gear</span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[320px] mx-auto flex flex-col gap-3">
        <button
          onClick={() => navigate("/signup")}
          className="gp-grad w-full h-[54px] border-none rounded-[14px] text-white text-base font-bold cursor-pointer font-sans"
          style={{ boxShadow: "0 12px 30px rgba(37,99,235,.3)" }}
        >
          Create Account
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full h-[54px] rounded-[14px] bg-transparent border border-[#3f3f46] text-[#fafafa] text-base font-bold cursor-pointer font-sans"
        >
          Log In
        </button>
        <div className="flex items-center gap-3.5 my-3.5">
          <div className="flex-1 h-px bg-[#27272a]" />
          <span className="text-[11px] tracking-[.06em] text-[#71717a]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-[#27272a]" />
        </div>
        <div className="flex gap-3">
          <button
            disabled
            className="flex-1 h-[50px] rounded-[14px] bg-transparent border border-[#3f3f46] text-[#52525b] text-sm font-semibold cursor-not-allowed font-sans flex items-center justify-center gap-2"
          >
            <span className="font-extrabold">G</span>Google
          </button>
          <button
            disabled
            className="flex-1 h-[50px] rounded-[14px] bg-transparent border border-[#3f3f46] text-[#52525b] text-sm font-semibold cursor-not-allowed font-sans flex items-center justify-center gap-2"
          >
            <MaterialIcon name="phone_iphone" size={18} />
            Apple
          </button>
        </div>
      </div>
    </div>
  );
}
