// Mock data ported 1:1 from the GearPulse Claude Design source (`Component extends DCLogic`).

export const IMAGES = {
  KEYBOARD: "https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&q=80",
  STUDIO: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  GUITAR: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
  DRUMS: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80",
  LIVE: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
  WORSHIP: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  PROD: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80",
  PEDAL: "https://images.unsplash.com/photo-1614963366126-eb088ec2f9c4?w=800&q=80",
  MIC: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80",
};

export interface AccountType {
  id: string;
  emoji: string;
  name: string;
  desc: string;
}
export const accountTypes: AccountType[] = [
  { id: "musician", emoji: "🎸", name: "Musician", desc: "For performers and players" },
  { id: "producer", emoji: "🎛️", name: "Producer", desc: "For producers and beat makers" },
  { id: "engineer", emoji: "🎧", name: "Audio Engineer", desc: "For recording/mixing professionals" },
  { id: "brand", emoji: "🏢", name: "Brand", desc: "For music companies" },
  { id: "creator", emoji: "🎬", name: "Creator", desc: "For content creators" },
];

export interface InstrumentOption {
  id: string;
  emoji: string;
  name: string;
}
export const instrumentsData: InstrumentOption[] = [
  { id: "keyboard", emoji: "🎹", name: "Keyboard" },
  { id: "drums", emoji: "🥁", name: "Drums" },
  { id: "guitar", emoji: "🎸", name: "Guitar" },
  { id: "vocals", emoji: "🎤", name: "Vocals" },
  { id: "strings", emoji: "🎻", name: "Strings" },
  { id: "wind", emoji: "🎷", name: "Wind Instruments" },
  { id: "synth", emoji: "🎛️", name: "Synthesizers" },
  { id: "audio", emoji: "🎧", name: "Audio Equipment" },
];

export interface InterestSpace {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  members: string;
}
export const interestsData: InterestSpace[] = [
  { id: "keyboard", emoji: "🎹", name: "Keyboard Space", desc: "New keyboards, stage setups, performances", members: "12.5k" },
  { id: "drum", emoji: "🥁", name: "Drum Space", desc: "Drummers, kits, techniques, gear", members: "8.2k" },
  { id: "guitar", emoji: "🎸", name: "Guitar Space", desc: "Guitars, pedals, amps", members: "15.3k" },
  { id: "studio", emoji: "🎧", name: "Studio Space", desc: "Recording equipment and studio builds", members: "9.7k" },
  { id: "synth", emoji: "🎛️", name: "Synth Space", desc: "Synthesizers and electronic music", members: "11.2k" },
  { id: "live", emoji: "📡", name: "Live Sound Space", desc: "Mixing consoles, speakers, touring", members: "6.4k" },
  { id: "worship", emoji: "⛪", name: "Worship Space", desc: "Worship teams and setups", members: "7.8k" },
  { id: "production", emoji: "💻", name: "Music Production Space", desc: "DAWs, plugins, production", members: "13.9k" },
];

export interface Brand {
  id: string;
  name: string;
  emoji: string;
}
export const brandsData: Brand[] = [
  { id: "behringer", name: "Behringer", emoji: "🎹" },
  { id: "yamaha", name: "Yamaha", emoji: "🎼" },
  { id: "roland", name: "Roland", emoji: "🎹" },
  { id: "nord", name: "Nord", emoji: "🔴" },
  { id: "mackie", name: "Mackie", emoji: "🎚️" },
  { id: "sennheiser", name: "Sennheiser", emoji: "🎧" },
  { id: "shure", name: "Shure", emoji: "🎤" },
  { id: "focusrite", name: "Focusrite", emoji: "🔊" },
  { id: "fender", name: "Fender", emoji: "🎸" },
];

export interface FeedPost {
  id: number;
  author: string;
  username: string;
  verified: boolean;
  avatar: string;
  content: string;
  img: string | null;
  likes: number;
  comments: number;
  meta: string;
}
export const feedData: FeedPost[] = [
  {
    id: 1,
    author: "Yamaha",
    username: "@yamaha",
    verified: true,
    avatar: "🎹",
    content: "Introducing our newest stage keyboard - the CK88. Professional performance meets portability.",
    img: IMAGES.LIVE,
    likes: 2847,
    comments: 156,
    meta: "2h ago · Keyboard Space",
  },
  {
    id: 2,
    author: "Jacob Rivera",
    username: "@jacobr",
    verified: false,
    avatar: "👨‍🎤",
    content: "Finally completed my home studio setup! Took 6 months but it was worth every penny. What do you think?",
    img: IMAGES.STUDIO,
    likes: 423,
    comments: 38,
    meta: "4h ago · Studio Space",
  },
  {
    id: 3,
    author: "Focusrite",
    username: "@focusrite",
    verified: true,
    avatar: "🔴",
    content: "New firmware update for Scarlett interfaces is now live. Improved latency and stability. Link in bio.",
    img: null,
    likes: 1256,
    comments: 89,
    meta: "6h ago · Studio Space",
  },
  {
    id: 4,
    author: "Sarah Chen",
    username: "@sarahmusic",
    verified: false,
    avatar: "🎸",
    content: "My pedalboard evolution over the past 3 years. Swipe to see the journey!",
    img: IMAGES.PEDAL,
    likes: 892,
    comments: 67,
    meta: "8h ago · Guitar Space",
  },
];

export interface SpaceCard {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  members: string;
  grad: string;
  image: string;
}
export const spacesGridData: SpaceCard[] = [
  { id: "keyboard", emoji: "🎹", name: "Keyboard Space", desc: "New keyboards, stage setups, performances", members: "12.5k", grad: "linear-gradient(135deg,#2563eb,#0891b2)", image: IMAGES.KEYBOARD },
  { id: "drum", emoji: "🥁", name: "Drum Space", desc: "Drummers, kits, techniques, gear", members: "8.2k", grad: "linear-gradient(135deg,#ea580c,#dc2626)", image: IMAGES.DRUMS },
  { id: "guitar", emoji: "🎸", name: "Guitar Space", desc: "Guitars, pedals, amps", members: "15.3k", grad: "linear-gradient(135deg,#9333ea,#db2777)", image: IMAGES.GUITAR },
  { id: "studio", emoji: "🎧", name: "Studio Space", desc: "Recording equipment and studio builds", members: "9.7k", grad: "linear-gradient(135deg,#059669,#0d9488)", image: IMAGES.STUDIO },
  { id: "synth", emoji: "🎛️", name: "Synth Space", desc: "Synthesizers and electronic music", members: "11.2k", grad: "linear-gradient(135deg,#7c3aed,#9333ea)", image: IMAGES.KEYBOARD },
  { id: "live", emoji: "📡", name: "Live Sound Space", desc: "Mixing consoles, speakers, touring", members: "6.4k", grad: "linear-gradient(135deg,#ca8a04,#ea580c)", image: IMAGES.LIVE },
  { id: "worship", emoji: "⛪", name: "Worship Space", desc: "Worship teams and setups", members: "7.8k", grad: "linear-gradient(135deg,#4f46e5,#2563eb)", image: IMAGES.WORSHIP },
  { id: "production", emoji: "💻", name: "Music Production Space", desc: "DAWs, plugins, production", members: "13.9k", grad: "linear-gradient(135deg,#db2777,#e11d48)", image: IMAGES.PROD },
];

export interface SpacePost {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  time: string;
}
export const spaceFeedData: SpacePost[] = [
  { id: 1, author: "Mike Johnson", avatar: "👨‍🎤", content: "Just got the new Nord Stage 4. The piano sounds are incredible!", image: IMAGES.KEYBOARD, likes: 234, comments: 18, time: "3h ago" },
  { id: 2, author: "Sarah Chen", avatar: "🎹", content: "Looking for recommendations for a good MIDI controller under $500", image: null, likes: 89, comments: 42, time: "5h ago" },
];

export interface TrendingGear {
  id: number;
  name: string;
  category: string;
  trend: string;
  emoji: string;
}
export const trendingGearData: TrendingGear[] = [
  { id: 1, name: "Nord Stage 4", category: "Keyboard", trend: "+156%", emoji: "🎹" },
  { id: 2, name: "Shure SM7B", category: "Microphone", trend: "+89%", emoji: "🎤" },
  { id: 3, name: "Yamaha CK88", category: "Stage Piano", trend: "+67%", emoji: "🎼" },
];

export interface SearchCreator {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followers: string;
  verified: boolean;
}
export const searchCreatorsData: SearchCreator[] = [
  { id: 1, name: "Sarah Chen", username: "@sarahmusic", avatar: "🎸", followers: "45.2k", verified: false },
  { id: 2, name: "Mike Johnson", username: "@mikej", avatar: "🎹", followers: "32.8k", verified: true },
];

export interface PopularSpace {
  id: number;
  name: string;
  members: string;
  emoji: string;
}
export const popularSpacesData: PopularSpace[] = [
  { id: 1, name: "Guitar Space", members: "15.3k", emoji: "🎸" },
  { id: 2, name: "Keyboard Space", members: "12.5k", emoji: "🎹" },
  { id: 3, name: "Production Space", members: "13.9k", emoji: "💻" },
];

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  verified: boolean;
}
export const chatsData: Chat[] = [
  { id: 1, name: "Sarah Chen", avatar: "🎸", lastMessage: "Thanks! The pedalboard setup looks amazing", time: "2m ago", unread: true, verified: false },
  { id: 2, name: "Mike Johnson", avatar: "🎹", lastMessage: "Have you tried the new Nord update?", time: "1h ago", unread: false, verified: false },
  { id: 3, name: "Yamaha", avatar: "🎼", lastMessage: "We're excited to announce...", time: "3h ago", unread: false, verified: true },
  { id: 4, name: "Alex Rivera", avatar: "🥁", lastMessage: "The drum session was incredible!", time: "1d ago", unread: false, verified: false },
];

export interface RigItem {
  id: string;
  name: string;
  type: string;
  emoji: string;
  year: string;
  image: string;
}
export const rigData: RigItem[] = [
  { id: "yamaha-ck88", name: "Yamaha CK88", type: "Stage Keyboard", emoji: "🎹", year: "2026", image: IMAGES.KEYBOARD },
  { id: "focusrite-scarlett-18i20", name: "Focusrite Scarlett 18i20", type: "Audio Interface", emoji: "🔌", year: "2024", image: IMAGES.STUDIO },
  { id: "shure-sm7b", name: "Shure SM7B", type: "Dynamic Microphone", emoji: "🎤", year: "2025", image: IMAGES.MIC },
];

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}
export const mockReviews: Review[] = [
  { id: 1, user: "Mark P.", avatar: "🎹", rating: 5, text: "Best keyboard I've ever played. The action is incredible and the sounds are studio quality — worth every penny.", date: "2 weeks ago" },
  { id: 2, user: "Sarah K.", avatar: "🎸", rating: 5, text: "Been using this live for 6 months and it never lets me down. The build quality is exceptional.", date: "1 month ago" },
  { id: 3, user: "DJ Mike", avatar: "🎧", rating: 4, text: "Amazing quality overall. My only complaint is the weight, but that's expected at this level.", date: "3 months ago" },
];

export const ratingBars = [
  { star: 5, pct: "72%" },
  { star: 4, pct: "18%" },
  { star: 3, pct: "6%" },
  { star: 2, pct: "2%" },
  { star: 1, pct: "2%" },
];

export interface NotificationItem {
  avatar: string;
  actor: string;
  action: string;
  time: string;
  icon: string;
  iconColor: string;
  unread: boolean;
  thumb: string | null;
}
export interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}
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

export interface SettingsItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  sub?: string;
  isToggle: boolean;
  isNav: boolean;
  stateKey?: "pushNotif" | "privateAcct";
  route?: string;
}
export interface SettingsSection {
  label: string;
  items: SettingsItem[];
}
export const settingsSections: SettingsSection[] = [
  {
    label: "ACCOUNT",
    items: [
      { icon: "person", iconColor: "#c084fc", iconBg: "rgba(192,132,252,.15)", title: "Edit profile", isToggle: false, isNav: true, route: "/app/profile/edit" },
      { icon: "lock", iconColor: "#60a5fa", iconBg: "rgba(96,165,250,.15)", title: "Account & security", isToggle: false, isNav: true },
      { icon: "verified", iconColor: "#34d399", iconBg: "rgba(52,211,153,.15)", title: "Get verified", sub: "Apply for a verified badge", isToggle: false, isNav: true },
    ],
  },
  {
    label: "PREFERENCES",
    items: [
      { icon: "notifications", iconColor: "#f59e0b", iconBg: "rgba(245,158,11,.15)", title: "Push notifications", isToggle: true, isNav: false, stateKey: "pushNotif" },
      { icon: "visibility_off", iconColor: "#a855f7", iconBg: "rgba(168,85,247,.15)", title: "Private account", sub: "Approve followers manually", isToggle: true, isNav: false, stateKey: "privateAcct" },
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
