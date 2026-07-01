import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
} from "./data";
import type { AppNotification, NotificationType } from "@/types";

const TYPE_META: Record<NotificationType, { icon: string; iconColor: string; action: string }> = {
  like: { icon: "favorite", iconColor: "#ec4899", action: "liked your post" },
  comment: { icon: "mode_comment", iconColor: "#60a5fa", action: "commented on your post" },
  follow: { icon: "person_add", iconColor: "#3b82f6", action: "started following you" },
  mention: { icon: "alternate_email", iconColor: "#34d399", action: "mentioned you" },
  announcement: { icon: "campaign", iconColor: "#f59e0b", action: "posted an announcement" },
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function groupByDay(items: AppNotification[]): { label: string; items: AppNotification[] }[] {
  const today: AppNotification[] = [];
  const earlier: AppNotification[] = [];
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  for (const n of items) {
    (new Date(n.created_at) >= startOfToday ? today : earlier).push(n);
  }
  const groups = [];
  if (today.length) groups.push({ label: "TODAY", items: today });
  if (earlier.length) groups.push({ label: "EARLIER", items: earlier });
  return groups;
}

export function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id).then(setItems);
    const unsubscribe = subscribeToNotifications(user.id, (row) => {
      setItems((prev) => (prev ? [row, ...prev] : [row]));
    });
    return unsubscribe;
  }, [user]);

  async function handleOpen(n: AppNotification) {
    if (!n.read) {
      setItems((prev) => prev?.map((it) => (it.id === n.id ? { ...it, read: true } : it)) ?? null);
      markNotificationRead(n.id);
    }
    if (n.post_id) navigate("/app");
    else if (n.space_id) navigate(`/app/spaces/${n.space_id}`);
  }

  async function handleMarkAllRead() {
    if (!user) return;
    setItems((prev) => prev?.map((it) => ({ ...it, read: true })) ?? null);
    await markAllNotificationsRead(user.id);
  }

  const groups = items ? groupByDay(items) : [];

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app")} />
          <h1 className="text-xl font-extrabold tracking-[-.02em]">Notifications</h1>
        </div>
        <span onClick={handleMarkAllRead} className="text-[12.5px] font-semibold text-[#60a5fa] cursor-pointer">
          Mark all read
        </span>
      </div>

      {items === null && <div className="px-4 py-10 text-center text-sm text-[#71717a]">Loading…</div>}

      {items !== null && items.length === 0 && (
        <div className="flex flex-col items-center text-center px-8 pt-14 pb-2">
          <div className="w-[84px] h-[84px] rounded-[24px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
            <MaterialIcon name="notifications" size={40} color="#52525b" />
          </div>
          <h2 className="text-[21px] font-extrabold tracking-[-.01em]">No notifications yet</h2>
          <p className="text-sm text-[#a1a1aa] mt-2 leading-[1.5] max-w-[280px]" style={{ textWrap: "balance" }}>
            Likes, comments, and follows will show up here.
          </p>
        </div>
      )}

      {groups.map((grp) => (
        <div key={grp.label}>
          <div className="px-4 pt-4 pb-1 text-[11.5px] font-bold text-[#71717a] tracking-[.06em]">{grp.label}</div>
          {grp.items.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <div
                key={n.id}
                onClick={() => handleOpen(n)}
                className="flex items-start gap-3.5 px-4 py-3.5 border-b border-[#27272a] cursor-pointer"
                style={{ background: !n.read ? "rgba(59,130,246,.06)" : "transparent" }}
              >
                <div className="relative flex-none">
                  <div className="gp-grad w-[46px] h-[46px] rounded-full flex items-center justify-center text-[23px] overflow-hidden">
                    {n.actor?.avatar_url ? (
                      <img src={n.actor.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      n.actor?.avatar_emoji ?? "🎵"
                    )}
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full border-[2.5px] border-[#09090b] flex items-center justify-center"
                    style={{ background: meta.iconColor }}
                  >
                    <MaterialIcon name={meta.icon} size={13} color="#fff" filled />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-sm leading-[1.45] text-[#d4d4d8]">
                    <span className="font-bold text-[#fafafa]">{n.actor?.display_name ?? "Someone"}</span>{" "}
                    {n.content && n.type === "comment" ? `commented: "${n.content}"` : meta.action}
                  </div>
                  <div className="text-[11.5px] text-[#71717a] mt-[3px]">{timeAgo(n.created_at)}</div>
                </div>
                {n.post_image_url && (
                  <div className="w-[46px] h-[46px] rounded-[10px] overflow-hidden flex-none">
                    <img src={n.post_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                {!n.read && <div className="w-[9px] h-[9px] rounded-full bg-[#3b82f6] flex-none mt-[18px]" />}
              </div>
            );
          })}
        </div>
      ))}
      <div className="h-5" />
    </div>
  );
}
