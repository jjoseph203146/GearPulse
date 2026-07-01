import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { rigData } from "@/features/profile/data";
import type { RigItem } from "@/types";

interface AppStateValue {
  types: string[];
  setTypes: (ids: string[]) => void;
  instruments: string[];
  toggleInstrument: (id: string) => void;
  interests: string[];
  toggleInterest: (id: string) => void;
  follows: string[];
  toggleFollow: (id: string) => void;

  spaceTab: string;
  setSpaceTab: (tab: string) => void;
  profileTab: string;
  setProfileTab: (tab: string) => void;

  likedPosts: number[];
  toggleLike: (id: number) => void;
  savedPosts: number[];
  toggleSave: (id: number) => void;

  gearTab: string;
  setGearTab: (tab: string) => void;
  gearAdded: boolean;
  rig: RigItem[];
  addToRig: (gearId: string) => void;

  gearQuery: string;
  setGearQuery: (q: string) => void;
  gearCat: string;
  setGearCat: (c: string) => void;

  customName: string;
  setCustomName: (v: string) => void;
  customBrand: string;
  setCustomBrand: (v: string) => void;
  customCat: string;
  setCustomCat: (v: string) => void;
  customMode: "profile" | "catalog";
  setCustomMode: (v: "profile" | "catalog") => void;
  customSubmitted: boolean;
  submitCustom: () => boolean;

  puUsername: string;
  setPuUsername: (v: string) => void;
  puDisplay: string;
  setPuDisplay: (v: string) => void;

  pushNotif: boolean;
  privateAcct: boolean;
  toggleSetting: (key: "pushNotif" | "privateAcct") => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function toggleInArray<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [types, setTypes] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [follows, setFollows] = useState<string[]>([]);

  const [spaceTab, setSpaceTab] = useState("Posts");
  const [profileTab, setProfileTab] = useState("My Rig");

  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const [gearTab, setGearTab] = useState("details");
  const [gearAdded, setGearAdded] = useState(false);
  const [rig, setRig] = useState<RigItem[]>(rigData);

  const [gearQuery, setGearQuery] = useState("");
  const [gearCat, setGearCat] = useState("all");

  const [customName, setCustomName] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [customCat, setCustomCat] = useState("");
  const [customMode, setCustomMode] = useState<"profile" | "catalog">("profile");
  const [customSubmitted, setCustomSubmitted] = useState(false);

  const [puUsername, setPuUsername] = useState("");
  const [puDisplay, setPuDisplay] = useState("");

  const [pushNotif, setPushNotif] = useState(true);
  const [privateAcct, setPrivateAcct] = useState(false);

  const addToRig = useCallback(
    (gearId: string) => {
      setGearAdded(true);
      setRig((prev) => {
        if (prev.some((g) => g.id === gearId)) return prev;
        return prev;
      });
    },
    [],
  );

  const submitCustom = useCallback(() => {
    if (!(customName.trim() && customBrand.trim() && customCat)) return false;
    setCustomSubmitted(true);
    return true;
  }, [customName, customBrand, customCat]);

  const toggleSetting = useCallback((key: "pushNotif" | "privateAcct") => {
    if (key === "pushNotif") setPushNotif((v) => !v);
    else setPrivateAcct((v) => !v);
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      types,
      setTypes,
      instruments,
      toggleInstrument: (id) => setInstruments((a) => toggleInArray(a, id)),
      interests,
      toggleInterest: (id) => setInterests((a) => toggleInArray(a, id)),
      follows,
      toggleFollow: (id) => setFollows((a) => toggleInArray(a, id)),

      spaceTab,
      setSpaceTab,
      profileTab,
      setProfileTab,

      likedPosts,
      toggleLike: (id) => setLikedPosts((a) => toggleInArray(a, id)),
      savedPosts,
      toggleSave: (id) => setSavedPosts((a) => toggleInArray(a, id)),

      gearTab,
      setGearTab,
      gearAdded,
      rig,
      addToRig,

      gearQuery,
      setGearQuery,
      gearCat,
      setGearCat,

      customName,
      setCustomName,
      customBrand,
      setCustomBrand,
      customCat,
      setCustomCat,
      customMode,
      setCustomMode,
      customSubmitted,
      submitCustom,

      puUsername,
      setPuUsername,
      puDisplay,
      setPuDisplay,

      pushNotif,
      privateAcct,
      toggleSetting,
    }),
    [
      types,
      instruments,
      interests,
      follows,
      spaceTab,
      profileTab,
      likedPosts,
      savedPosts,
      gearTab,
      gearAdded,
      rig,
      addToRig,
      gearQuery,
      gearCat,
      customName,
      customBrand,
      customCat,
      customMode,
      customSubmitted,
      submitCustom,
      puUsername,
      puDisplay,
      pushNotif,
      privateAcct,
      toggleSetting,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
