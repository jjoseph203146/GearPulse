import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAppState } from "@/state/AppState";

const inputClass =
  "w-full h-12 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 text-[15px] outline-none placeholder:text-[#52525b]";

export function CreateProfile() {
  const navigate = useNavigate();
  const { puUsername, setPuUsername, puDisplay, setPuDisplay } = useAppState();
  const ready = !!(puUsername.trim() && puDisplay.trim());

  function complete() {
    if (ready) navigate("/app");
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-10">
      <OnboardingHeader back="/onboarding/brands" step={5} />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em]">Create your profile</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-7">Tell the community about yourself</p>
      <div className="flex flex-col items-center mb-7">
        <button className="gp-grad w-24 h-24 rounded-full border-none flex items-center justify-center cursor-pointer mb-3">
          <MaterialIcon name="photo_camera" size={34} color="#fff" />
        </button>
        <span className="text-sm text-[#a1a1aa]">Add profile picture</span>
      </div>
      <div className="flex flex-col gap-[18px]">
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Username *</label>
          <input
            value={puUsername}
            onChange={(e) => setPuUsername(e.target.value)}
            placeholder="@yourname"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Display Name *</label>
          <input
            value={puDisplay}
            onChange={(e) => setPuDisplay(e.target.value)}
            placeholder="Your Name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Bio</label>
          <textarea
            placeholder="Tell us about yourself..."
            className="w-full h-20 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 py-3 text-[15px] outline-none resize-none placeholder:text-[#52525b]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Location</label>
          <div className="relative">
            <MaterialIcon
              name="location_on"
              size={20}
              color="#71717a"
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input placeholder="City, Country" className={`${inputClass} pl-[42px]`} />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">My Rig</label>
          <textarea
            placeholder={"List your gear, e.g.:\nYamaha CK88\nFocusrite Interface\nShure Microphone"}
            className="w-full h-[104px] rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 py-3 text-[15px] outline-none resize-none placeholder:text-[#52525b]"
          />
        </div>
      </div>
      <button
        onClick={complete}
        disabled={!ready}
        className="mt-7 w-full h-[54px] border-none rounded-[14px] text-base font-bold cursor-pointer font-sans"
        style={{
          background: ready ? "linear-gradient(135deg,#9333ea,#db2777)" : "#27272a",
          color: ready ? "#fff" : "#52525b",
        }}
      >
        Complete Setup
      </button>
      {!ready && (
        <p className="text-[11.5px] text-[#52525b] text-center mt-2.5">
          Username and display name are required to continue
        </p>
      )}
    </div>
  );
}
