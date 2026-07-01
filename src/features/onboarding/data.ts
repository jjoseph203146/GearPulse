import type { AccountType, InstrumentOption, InterestSpace, Brand } from "@/types";

export const accountTypes: AccountType[] = [
  { id: "musician", emoji: "🎸", name: "Musician", desc: "For performers and players" },
  { id: "producer", emoji: "🎛️", name: "Producer", desc: "For producers and beat makers" },
  { id: "engineer", emoji: "🎧", name: "Audio Engineer", desc: "For recording/mixing professionals" },
  { id: "brand", emoji: "🏢", name: "Brand", desc: "For music companies" },
  { id: "creator", emoji: "🎬", name: "Creator", desc: "For content creators" },
];

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
