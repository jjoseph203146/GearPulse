import type { SettingsSection } from "@/types";

export const settingsSections: SettingsSection[] = [
  {
    label: "ACCOUNT",
    items: [
      { icon: "person", iconColor: "#60a5fa", iconBg: "rgba(96,165,250,.15)", title: "Edit profile", isToggle: false, isNav: true, route: "/app/profile/edit" },
      { icon: "lock", iconColor: "#60a5fa", iconBg: "rgba(96,165,250,.15)", title: "Account & security", isToggle: false, isNav: true },
      { icon: "verified", iconColor: "#34d399", iconBg: "rgba(52,211,153,.15)", title: "Get verified", sub: "Apply for a verified badge", isToggle: false, isNav: true },
    ],
  },
  {
    label: "PREFERENCES",
    items: [
      { icon: "notifications", iconColor: "#f59e0b", iconBg: "rgba(245,158,11,.15)", title: "Push notifications", isToggle: true, isNav: false, stateKey: "pushNotif" },
      { icon: "visibility_off", iconColor: "#3b82f6", iconBg: "rgba(59,130,246,.15)", title: "Private account", sub: "Approve followers manually", isToggle: true, isNav: false, stateKey: "privateAcct" },
      { icon: "dark_mode", iconColor: "#94a3b8", iconBg: "rgba(148,163,184,.15)", title: "Appearance", sub: "Dark", isToggle: false, isNav: true },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { icon: "help", iconColor: "#60a5fa", iconBg: "rgba(96,165,250,.15)", title: "Help center", isToggle: false, isNav: true },
      { icon: "flag", iconColor: "#f59e0b", iconBg: "rgba(245,158,11,.15)", title: "Report a problem", isToggle: false, isNav: true },
      { icon: "description", iconColor: "#94a3b8", iconBg: "rgba(148,163,184,.15)", title: "Terms & privacy", isToggle: false, isNav: true },
    ],
  },
];
