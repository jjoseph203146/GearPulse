import type { Chat } from "@/types";

export const chatsData: Chat[] = [
  { id: 1, name: "Sarah Chen", avatar: "🎸", lastMessage: "Thanks! The pedalboard setup looks amazing", time: "2m ago", unread: true, verified: false },
  { id: 2, name: "Mike Johnson", avatar: "🎹", lastMessage: "Have you tried the new Nord update?", time: "1h ago", unread: false, verified: false },
  { id: 3, name: "Yamaha", avatar: "🎼", lastMessage: "We're excited to announce...", time: "3h ago", unread: false, verified: true },
  { id: 4, name: "Alex Rivera", avatar: "🥁", lastMessage: "The drum session was incredible!", time: "1d ago", unread: false, verified: false },
];
