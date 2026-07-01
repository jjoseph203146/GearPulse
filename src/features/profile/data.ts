import type { RigItem } from "@/types";
import { IMAGES } from "@/lib/images";

export const rigData: RigItem[] = [
  { id: "yamaha-ck88", name: "Yamaha CK88", type: "Stage Keyboard", emoji: "🎹", year: "2026", image: IMAGES.KEYBOARD },
  { id: "focusrite-scarlett-18i20", name: "Focusrite Scarlett 18i20", type: "Audio Interface", emoji: "🔌", year: "2024", image: IMAGES.STUDIO },
  { id: "shure-sm7b", name: "Shure SM7B", type: "Dynamic Microphone", emoji: "🎤", year: "2025", image: IMAGES.MIC },
];
