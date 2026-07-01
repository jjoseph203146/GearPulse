import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

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

  const [puUsername, setPuUsername] = useState("");
  const [puDisplay, setPuDisplay] = useState("");

  const [pushNotif, setPushNotif] = useState(true);
  const [privateAcct, setPrivateAcct] = useState(false);

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

      puUsername,
      setPuUsername,
      puDisplay,
      setPuDisplay,

      pushNotif,
      privateAcct,
      toggleSetting,
    }),
    [types, instruments, interests, follows, spaceTab, profileTab, puUsername, puDisplay, pushNotif, privateAcct, toggleSetting],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
