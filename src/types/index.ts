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

export interface PostGearTag {
  id: string;
  refId: string | null;
  name: string;
  emoji: string;
  image: string;
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
  gear: PostGearTag[];
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


export interface ConversationListItem {
  id: string;
  other: PostAuthor;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unread: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
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

export type NotificationType = "like" | "follow" | "comment" | "mention" | "announcement";

export interface AppNotification {
  id: string;
  type: NotificationType;
  content: string | null;
  read: boolean;
  created_at: string;
  post_id: string | null;
  space_id: string | null;
  actor: PostAuthor | null;
  post_image_url: string | null;
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
  postsCount: number;
  related: GearListItem[];
}

export interface GearReview {
  id: string;
  rating: number;
  text: string | null;
  created_at: string;
  author: PostAuthor;
}
