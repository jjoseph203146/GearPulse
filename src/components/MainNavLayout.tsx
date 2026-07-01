import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";

const NAV_ITEMS = [
  { icon: "home", label: "Home", path: "/app", group: "home" },
  { icon: "explore", label: "Explore", path: "/app/search", group: "search" },
  { icon: "groups", label: "Spaces", path: "/app/spaces", group: "spaces" },
  { icon: "chat_bubble", label: "Messages", path: "/app/messages", group: "messages" },
  { icon: "person", label: "Profile", path: "/app/profile", group: "profile" },
];

function groupForPath(pathname: string): string {
  if (pathname === "/app") return "home";
  if (pathname.startsWith("/app/spaces")) return "spaces";
  if (pathname.startsWith("/app/search")) return "search";
  if (pathname.startsWith("/app/messages")) return "messages";
  if (pathname.startsWith("/app/profile")) return "profile";
  return "";
}

// Full-screen flows (chat thread, composer) manage their own header/footer
// and intentionally hide the tab bar, so skip nav rendering + padding there.
function isImmersivePath(pathname: string): boolean {
  return pathname.startsWith("/app/messages/") || pathname === "/app/create-post";
}

export function MainNavLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const group = groupForPath(location.pathname);
  const isHome = location.pathname === "/app";
  const immersive = isImmersivePath(location.pathname);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
      <div
        className="flex-1"
        style={immersive ? undefined : { paddingBottom: "calc(78px + env(safe-area-inset-bottom))" }}
      >
        <Outlet />
      </div>

      {isHome && (
        <div
          onClick={() => navigate("/app/create-post")}
          className="gp-grad fixed right-[18px] w-14 h-14 rounded-[18px] flex items-center justify-center cursor-pointer z-50"
          style={{ boxShadow: "0 12px 30px rgba(37,99,235,.45)", bottom: "calc(92px + env(safe-area-inset-bottom))" }}
        >
          <MaterialIcon name="edit" size={28} color="#fff" />
        </div>
      )}

      {!immersive && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-around items-center px-2 pt-2.5 bg-[#18181b] border-t border-[#27272a] max-w-screen-md mx-auto w-full z-40"
          style={{ paddingBottom: "calc(14px + env(safe-area-inset-bottom))" }}
        >
          {NAV_ITEMS.map((n) => {
            const active = n.group === group;
            const color = active ? "#3b82f6" : "#71717a";
            return (
              <div
                key={n.group}
                onClick={() => navigate(n.path)}
                className="flex flex-col items-center gap-1 cursor-pointer flex-1"
              >
                <MaterialIcon name={n.icon} size={25} color={color} filled={active} />
                <span className="text-[10.5px] font-semibold" style={{ color }}>
                  {n.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
