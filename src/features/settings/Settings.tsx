import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { settingsSections } from "./data";
import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";

export function Settings() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { pushNotif, privateAcct, toggleSetting } = useAppState();
  const switchState = { pushNotif, privateAcct };

  async function handleLogOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center gap-3 px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/profile")} />
        <h1 className="text-xl font-extrabold tracking-[-.02em]">Settings</h1>
      </div>
      <div className="p-4">
        <div
          onClick={() => navigate("/app/profile/edit")}
          className="flex items-center gap-3.5 p-4 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer mb-[26px]"
        >
          <div className="gp-grad w-[54px] h-[54px] rounded-full flex items-center justify-center text-[26px] flex-none">
            👨‍🎤
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold">Jacob Rivera</div>
            <div className="text-[13px] text-[#a1a1aa]">@jacobr · View profile</div>
          </div>
          <MaterialIcon name="chevron_right" size={20} color="#3f3f46" />
        </div>
        {settingsSections.map((grp) => (
          <div key={grp.label}>
            <div className="text-[11.5px] font-bold text-[#71717a] tracking-[.06em] mx-1 mb-2.5">{grp.label}</div>
            <div className="rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] overflow-hidden mb-6">
              {grp.items.map((it, i) => {
                const on = it.stateKey ? switchState[it.stateKey] : false;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (it.isToggle && it.stateKey) toggleSetting(it.stateKey);
                      else if (it.route) navigate(it.route);
                    }}
                    className="flex items-center gap-3.5 px-4 py-3.5 border-b border-[rgba(39,39,42,.6)] cursor-pointer last:border-b-0"
                  >
                    <div
                      className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-none"
                      style={{ background: it.iconBg }}
                    >
                      <MaterialIcon name={it.icon} size={19} color={it.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14.5px] font-semibold text-[#fafafa]">{it.title}</div>
                      {it.sub && <div className="text-[11.5px] text-[#71717a] mt-px">{it.sub}</div>}
                    </div>
                    {it.isToggle && (
                      <div
                        className="w-11 h-[26px] rounded-full relative flex-none transition-colors"
                        style={{ background: on ? "#2563eb" : "#3f3f46" }}
                      >
                        <div
                          className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform"
                          style={{ transform: on ? "translateX(18px)" : "translateX(0)" }}
                        />
                      </div>
                    )}
                    {it.isNav && <MaterialIcon name="chevron_right" size={20} color="#3f3f46" className="flex-none" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <button
          onClick={handleLogOut}
          className="w-full h-[50px] rounded-2xl bg-[rgba(239,68,68,.1)] border border-[rgba(239,68,68,.3)] text-[#f87171] text-[15px] font-bold cursor-pointer font-sans flex items-center justify-center gap-2"
        >
          <MaterialIcon name="logout" size={20} />
          Log Out
        </button>
        <p className="text-center text-[11.5px] text-[#52525b] mt-4">GearPulse v1.0.0 (beta)</p>
      </div>
    </div>
  );
}
