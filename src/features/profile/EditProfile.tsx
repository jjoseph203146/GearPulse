import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";

const inputClass =
  "w-full h-12 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 text-[15px] outline-none placeholder:text-[#52525b]";

export function EditProfile() {
  const navigate = useNavigate();
  const { rig } = useAppState();
  const { profile } = useAuth();

  return (
    <div className="flex flex-col min-h-screen max-w-screen-md mx-auto">
      <div className="flex-none flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <span onClick={() => navigate("/app/settings")} className="text-[15px] font-semibold text-[#a1a1aa] cursor-pointer">
          Cancel
        </span>
        <span className="text-base font-extrabold">Edit Profile</span>
        <button
          onClick={() => navigate("/app/profile")}
          className="gp-grad h-9 px-[18px] rounded-[10px] border-none text-white text-[13.5px] font-bold cursor-pointer font-sans"
        >
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-10">
        <div className="flex flex-col items-center mb-7">
          <AvatarUpload avatarUrl={profile?.avatar_url} fallbackEmoji={profile?.avatar_emoji ?? "👨‍🎤"} size={96} />
        </div>
        <div className="flex flex-col gap-[18px]">
          <div>
            <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Display Name</label>
            <input defaultValue="Jacob Rivera" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Username</label>
            <input defaultValue="@jacobr" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Bio</label>
            <textarea
              defaultValue="Keyboard player & producer 🎹 Building my dream studio one piece at a time"
              className="w-full h-[90px] rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 py-3 text-[15px] outline-none resize-none"
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
              <input defaultValue="Los Angeles, CA" className={`${inputClass} pl-[42px]`} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Website</label>
            <input placeholder="yourwebsite.com" className={inputClass} />
          </div>
        </div>
        <div
          onClick={() => navigate("/app/profile/my-rig")}
          className="flex items-center gap-3 mt-[22px] p-4 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
        >
          <MaterialIcon name="inventory_2" size={22} color="#c084fc" />
          <div className="flex-1">
            <div className="text-[14.5px] font-semibold">Edit My Rig</div>
            <div className="text-[11.5px] text-[#71717a] mt-px">{rig.length} pieces of gear</div>
          </div>
          <MaterialIcon name="chevron_right" size={20} color="#3f3f46" />
        </div>
      </div>
    </div>
  );
}
