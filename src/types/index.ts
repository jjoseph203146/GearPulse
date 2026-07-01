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

export interface PostAuthor {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  avatar_emoji: string | null;
  verified: boolean;
}

export interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  space_id: string | null;
  author_id: string;
  author: PostAuthor;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  saved_by_me: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  author: PostAuthor;
}

export interface SpaceListItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string | null;
  image: string | null;
  isPublic: boolean;
  isMine: boolean;
  joined: boolean;
  memberCount: number;
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
  refId: string | null;
  name: string;
  type: string;
  emoji: string;
  year: string;
  image: string;
  isCustom: boolean;
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

export interface GearCategory {
  id: string;
  label: string;
  emoji: string;
}

export interface GearListItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryId: string;
  categoryEmoji: string;
  image: string;
  ownersCount: number;
}

export interface GearDetail extends GearListItem {
  description: string;
  specs: GearSpec[];
  rating: number;
  reviewsCount: number;
  related: GearListItem[];
}

export interface GearReview {
  id: string;
  rating: number;
  text: string | null;
  created_at: string;
  author: PostAuthor;
}
