export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_emoji: string | null;
  avatar_url: string | null;
  bio: string | null;
  account_type: string | null;
  verified: boolean;
  push_notif: boolean;
  private_account: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

export interface AccountType {
  id: string;
  emoji: string;
  name: string;
  desc: string;
}

export interface InstrumentOption {
  id: string;
  emoji: string;
  name: string;
}

export interface InterestSpace {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  members: string;
}

export interface Brand {
  id: string;
  name: string;
  emoji: string;
}

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

export interface SpaceCard {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  members: string;
  grad: string;
  image: string;
}

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

export interface TrendingGear {
  id: number;
  name: string;
  category: string;
  trend: string;
  emoji: string;
}

export interface SearchCreator {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followers: string;
  verified: boolean;
}

export interface PopularSpace {
  id: number;
  name: string;
  members: string;
  emoji: string;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  verified: boolean;
}

export interface RigItem {
  id: string;
  name: string;
  type: string;
  emoji: string;
  year: string;
  image: string;
}

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

export interface GearSpec {
  label: string;
  value: string;
}

export interface GearItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryId: string;
  categoryEmoji: string;
  image: string;
  description: string;
  specs: GearSpec[];
  ownersCount: number;
  postsCount: number;
  rating: number;
  reviewsCount: number;
  relatedIds: string[];
}
