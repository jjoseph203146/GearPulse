import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { spacesGridData } from "./data";

export function Spaces() {
  const navigate = useNavigate();

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] px-4 py-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <h1 className="text-2xl font-extrabold tracking-[-.02em]">Spaces</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Join communities and discover new gear</p>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {spacesGridData.map((sp) => (
          <div
            key={sp.id}
            onClick={() => navigate(`/app/spaces/${sp.id}`)}
            className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-[#18181b] cursor-pointer"
          >
            <div className="absolute inset-0 opacity-20">
              <img src={sp.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(0deg,#18181b 10%,rgba(24,24,27,.5),transparent)" }}
            />
            <div className="relative p-[22px]">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: sp.grad }}
                >
                  {sp.emoji}
                </div>
                <button className="h-[34px] px-4 rounded-[10px] border border-[#3f3f46] bg-[rgba(39,39,42,.8)] text-[#fafafa] text-[13px] font-semibold cursor-pointer font-sans">
                  Join
                </button>
              </div>
              <h3 className="text-xl font-extrabold tracking-[-.01em]">{sp.name}</h3>
              <p className="text-sm text-[#a1a1aa] mt-1.5 mb-3.5">{sp.desc}</p>
              <div className="flex items-center gap-[7px] text-[#71717a]">
                <MaterialIcon name="group" size={18} />
                <span className="text-[13.5px] whitespace-nowrap">{sp.members} members</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
