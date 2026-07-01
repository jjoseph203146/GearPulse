import type { SpaceCard, SpacePost } from "@/types";
import { IMAGES } from "@/lib/images";

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

export const spaceFeedData: SpacePost[] = [
  { id: 1, author: "Mike Johnson", avatar: "👨‍🎤", content: "Just got the new Nord Stage 4. The piano sounds are incredible!", image: IMAGES.KEYBOARD, likes: 234, comments: 18, time: "3h ago" },
  { id: 2, author: "Sarah Chen", avatar: "🎹", content: "Looking for recommendations for a good MIDI controller under $500", image: null, likes: 89, comments: 42, time: "5h ago" },
];
