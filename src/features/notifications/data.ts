import type { NotificationItem, NotificationGroup } from "@/types";
import { IMAGES } from "@/lib/images";

function notif(
  avatar: string,
  actor: string,
  action: string,
  time: string,
  icon: string,
  iconColor: string,
  opts: { unread?: boolean; thumb?: string } = {},
): NotificationItem {
  return { avatar, actor, action, time, icon, iconColor, unread: !!opts.unread, thumb: opts.thumb || null };
}

export const notifGroups: NotificationGroup[] = [
  {
    label: "TODAY",
    items: [
      notif("🎸", "Sarah Chen", "liked your studio setup post", "2m ago", "favorite", "#ec4899", { unread: true, thumb: IMAGES.STUDIO }),
      notif("🎹", "Mike Johnson", "started following you", "18m ago", "person_add", "#a855f7", { unread: true }),
      notif("🎼", "Yamaha", "dropped a new product — the CK88 stage keyboard", "1h ago", "campaign", "#f59e0b", { thumb: IMAGES.LIVE }),
    ],
  },
  {
    label: "EARLIER",
    items: [
      notif("🥁", "Alex Rivera", 'commented on your post: "What interface are you running?"', "1d ago", "mode_comment", "#60a5fa"),
      notif("🎸", "@sarahmusic", "mentioned you in Guitar Space", "2d ago", "alternate_email", "#34d399"),
      notif("🔊", "Focusrite", "liked your comment", "3d ago", "favorite", "#ec4899"),
    ],
  },
];
