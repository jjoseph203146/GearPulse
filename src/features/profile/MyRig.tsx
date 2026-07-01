import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAppState } from "@/hooks/useAppState";
import { EmptyRig } from "./EmptyRig";

export function MyRig() {
  const navigate = useNavigate();
  const { rig } = useAppState();

  if (rig.length === 0) return <EmptyRig />;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/profile")} />
          <div>
            <div className="text-[19px] font-extrabold leading-[1.1]">My Rig</div>
            <div className="text-[11.5px] text-[#71717a]">{rig.length} pieces of gear</div>
          </div>
        </div>
        <MaterialIcon name="share" size={22} color="#a1a1aa" className="cursor-pointer" />
      </div>
      <div className="p-4">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#27272a] mb-3">
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(24,24,27,.8),transparent)" }} />
          <button className="absolute bottom-3.5 right-3.5 w-[38px] h-[38px] rounded-[11px] bg-[rgba(24,24,27,.9)] border border-[#3f3f46] flex items-center justify-center cursor-pointer">
            <MaterialIcon name="photo_camera" size={18} color="#fff" />
          </button>
          <div className="absolute bottom-3.5 left-3.5">
            <div className="text-lg font-extrabold">Jacob's Studio Setup</div>
            <div className="text-xs text-[#a1a1aa]">Los Angeles, CA</div>
          </div>
        </div>
        <p className="text-sm leading-[1.5] text-[#a1a1aa] mb-5">
          My home studio setup — built over 2 years with gear collected along the way.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="py-4 px-2.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] text-center">
            <div className="gp-word text-2xl font-extrabold">{rig.length}</div>
            <div className="text-[11.5px] text-[#71717a] mt-[3px]">Pieces</div>
          </div>
          <div className="py-4 px-2.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] text-center">
            <div className="text-2xl font-extrabold text-[#60a5fa]">234</div>
            <div className="text-[11.5px] text-[#71717a] mt-[3px]">Views</div>
          </div>
          <div className="py-4 px-2.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] text-center">
            <div className="text-2xl font-extrabold text-[#34d399]">12</div>
            <div className="text-[11.5px] text-[#71717a] mt-[3px]">Saves</div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-[#d4d4d8]">Equipment</h3>
          <button
            onClick={() => navigate("/app/gear/search")}
            className="gp-grad h-[34px] px-3.5 rounded-[9px] border-none text-white text-[12.5px] font-bold cursor-pointer font-sans flex items-center gap-[5px]"
          >
            <MaterialIcon name="add" size={16} />
            Add Gear
          </button>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          {rig.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/app/gear/${g.id}`)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
            >
              <div className="w-[62px] h-[62px] rounded-xl overflow-hidden bg-[#27272a] flex-none">
                <img src={g.image} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px]">{g.emoji}</span>
                  <span className="text-[11.5px] text-[#71717a]">{g.type}</span>
                </div>
                <div className="text-[14.5px] font-bold mt-px">{g.name}</div>
                <div className="text-[11.5px] text-[#71717a] mt-px">Owned since {g.year}</div>
              </div>
              <MaterialIcon name="chevron_right" size={20} color="#3f3f46" />
            </div>
          ))}
        </div>
        <div
          onClick={() => navigate("/app/gear/search")}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#27272a] cursor-pointer mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center">
            <MaterialIcon name="add" size={18} color="#71717a" />
          </div>
          <span className="text-sm text-[#71717a] font-semibold">Add more gear to your rig</span>
        </div>
        <button className="gp-grad w-full h-12 rounded-xl border-none text-white text-[15px] font-bold cursor-pointer font-sans flex items-center justify-center gap-2">
          <MaterialIcon name="share" size={20} />
          Share My Rig
        </button>
      </div>
    </div>
  );
}
