import { Routes, Route } from "react-router-dom";
import { MainNavLayout } from "@/components/MainNavLayout";

import { Welcome } from "@/screens/onboarding/Welcome";
import { AccountType } from "@/screens/onboarding/AccountType";
import { Instruments } from "@/screens/onboarding/Instruments";
import { InterestsSpaces } from "@/screens/onboarding/InterestsSpaces";
import { FollowBrands } from "@/screens/onboarding/FollowBrands";
import { CreateProfile } from "@/screens/onboarding/CreateProfile";

import { Home } from "@/screens/main/Home";
import { Spaces } from "@/screens/main/Spaces";
import { Search } from "@/screens/main/Search";
import { Messages } from "@/screens/main/Messages";
import { Profile } from "@/screens/main/Profile";

import { SpaceDetail } from "@/screens/detail/SpaceDetail";
import { Chat } from "@/screens/detail/Chat";
import { MyRig } from "@/screens/detail/MyRig";

import { GearProductScreen } from "@/screens/gear/GearProductScreen";
import { GearSearchScreen } from "@/screens/gear/GearSearchScreen";
import { CustomGearScreen } from "@/screens/gear/CustomGearScreen";

import { CreatePost } from "@/screens/account/CreatePost";
import { Notifications } from "@/screens/account/Notifications";
import { Settings } from "@/screens/account/Settings";
import { EditProfile } from "@/screens/account/EditProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/onboarding/type" element={<AccountType />} />
      <Route path="/onboarding/instruments" element={<Instruments />} />
      <Route path="/onboarding/spaces" element={<InterestsSpaces />} />
      <Route path="/onboarding/brands" element={<FollowBrands />} />
      <Route path="/onboarding/profile" element={<CreateProfile />} />

      <Route path="/app" element={<MainNavLayout />}>
        <Route index element={<Home />} />
        <Route path="spaces" element={<Spaces />} />
        <Route path="spaces/:spaceId" element={<SpaceDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:chatId" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/my-rig" element={<MyRig />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="gear/search" element={<GearSearchScreen />} />
        <Route path="gear/custom" element={<CustomGearScreen />} />
        <Route path="gear/:gearId" element={<GearProductScreen />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
