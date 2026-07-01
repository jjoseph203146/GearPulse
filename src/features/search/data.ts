import type { TrendingGear, SearchCreator, PopularSpace } from "@/types";

export const trendingGearData: TrendingGear[] = [
  { id: 1, name: "Nord Stage 4", category: "Keyboard", trend: "+156%", emoji: "🎹" },
  { id: 2, name: "Shure SM7B", category: "Microphone", trend: "+89%", emoji: "🎤" },
  { id: 3, name: "Yamaha CK88", category: "Stage Piano", trend: "+67%", emoji: "🎼" },
];

export const searchCreatorsData: SearchCreator[] = [
  { id: 1, name: "Sarah Chen", username: "@sarahmusic", avatar: "🎸", followers: "45.2k", verified: false },
  { id: 2, name: "Mike Johnson", username: "@mikej", avatar: "🎹", followers: "32.8k", verified: true },
];

export const popularSpacesData: PopularSpace[] = [
  { id: 1, name: "Guitar Space", members: "15.3k", emoji: "🎸" },
  { id: 2, name: "Keyboard Space", members: "12.5k", emoji: "🎹" },
  { id: 3, name: "Production Space", members: "13.9k", emoji: "💻" },
];
