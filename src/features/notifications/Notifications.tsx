import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { notifGroups } from "./data";

export function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app")} />
          <h1 className="text-xl font-extrabold tracking-[-.02em]">Notifications</h1>
        </div>
        <span className="text-[12.5px] font-semibold text-[#60a5fa] cursor-pointer">Mark all read</span>
      </div>
      {notifGroups.map((grp) => (
        <div key={grp.label}>
          <div className="px-4 pt-4 pb-1 text-[11.5px] font-bold text-[#71717a] tracking-[.06em]">{grp.label}</div>
          {grp.items.map((n, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 px-4 py-3.5 border-b border-[#27272a] cursor-pointer"
              style={{ background: n.unread ? "rgba(59,130,246,.06)" : "transparent" }}
            >
              <div className="relative flex-none">
                <div className="gp-grad w-[46px] h-[46px] rounded-full flex items-center justify-center text-[23px]">
                  {n.avatar}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full border-[2.5px] border-[#09090b] flex items-center justify-center"
                  style={{ background: n.iconColor }}
                >
                  <MaterialIcon name={n.icon} size={13} color="#fff" filled />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-sm leading-[1.45] text-[#d4d4d8]">
                  <span className="font-bold text-[#fafafa]">{n.actor}</span> {n.action}
                </div>
                <div className="text-[11.5px] text-[#71717a] mt-[3px]">{n.time}</div>
              </div>
              {n.thumb && (
                <div className="w-[46px] h-[46px] rounded-[10px] overflow-hidden flex-none">
                  <img src={n.thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              {n.unread && <div className="w-[9px] h-[9px] rounded-full bg-[#3b82f6] flex-none mt-[18px]" />}
            </div>
          ))}
        </div>
      ))}
      <div className="h-5" />
    </div>
  );
}
