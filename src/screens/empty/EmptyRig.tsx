import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";

export function EmptyRig() {
  const navigate = useNavigate();

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/profile")} />
          <div>
            <div className="text-[19px] font-extrabold leading-[1.1]">My Rig</div>
            <div className="text-[11.5px] text-[#71717a]">0 pieces of gear</div>
          </div>
        </div>
        <MaterialIcon name="share" size={22} color="#3f3f46" />
      </div>
      <div className="flex flex-col items-center text-center px-8 py-[60px]">
        <div className="w-[84px] h-[84px] rounded-[24px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
          <MaterialIcon name="inventory_2" size={40} color="#52525b" />
        </div>
        <h2 className="text-xl font-extrabold">Your rig is empty</h2>
        <p className="text-sm text-[#a1a1aa] mt-2 leading-[1.5] max-w-[280px]" style={{ textWrap: "balance" }}>
          Add the gear you own to show the community your setup and get personalized recommendations.
        </p>
        <button
          onClick={() => navigate("/app/gear/search")}
          className="gp-grad mt-6 h-[50px] px-7 rounded-[14px] border-none text-white text-[15px] font-bold cursor-pointer font-sans flex items-center gap-2"
        >
          <MaterialIcon name="add" size={20} color="#fff" />
          Add Your First Gear
        </button>
      </div>
    </div>
  );
}
