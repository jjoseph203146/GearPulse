import { Routes, Route } from "react-router-dom";
import { MainNavLayout } from "@/components/MainNavLayout";
import { RequireAuth, RequireOnboarding, RedirectIfOnboarded } from "@/components/RouteGuards";

import { Welcome } from "@/features/auth/Welcome";
import { SignUp } from "@/features/auth/SignUp";
import { Login } from "@/features/auth/Login";
import { AccountType } from "@/features/onboarding/AccountType";
import { Instruments } from "@/features/onboarding/Instruments";
import { InterestsSpaces } from "@/features/onboarding/InterestsSpaces";
import { FollowBrands } from "@/features/onboarding/FollowBrands";
import { CreateProfile } from "@/features/onboarding/CreateProfile";

import { Home } from "@/features/feed/Home";
import { SavedPosts } from "@/features/feed/SavedPosts";
import { Spaces } from "@/features/spaces/Spaces";
import { Search } from "@/features/search/Search";
import { Messages } from "@/features/messages/Messages";
import { Profile } from "@/features/profile/Profile";
import { UserProfile } from "@/features/profile/UserProfile";

import { SpaceDetail } from "@/features/spaces/SpaceDetail";
import { Chat } from "@/features/messages/Chat";
import { MyRig } from "@/features/profile/MyRig";

import { GearProductScreen } from "@/features/gear/GearProductScreen";
import { GearSearchScreen } from "@/features/gear/GearSearchScreen";
import { CustomGearScreen } from "@/features/gear/CustomGearScreen";

import { CreatePost } from "@/features/posts/CreatePost";
import { Notifications } from "@/features/notifications/Notifications";
import { Settings } from "@/features/settings/Settings";
import { EditProfile } from "@/features/profile/EditProfile";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfOnboarded>
            <Welcome />
          </RedirectIfOnboarded>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfOnboarded>
            <SignUp />
          </RedirectIfOnboarded>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfOnboarded>
            <Login />
          </RedirectIfOnboarded>
        }
      />

      <Route element={<RequireAuth />}>
        <Route path="/onboarding/type" element={<AccountType />} />
        <Route path="/onboarding/instruments" element={<Instruments />} />
        <Route path="/onboarding/spaces" element={<InterestsSpaces />} />
        <Route path="/onboarding/brands" element={<FollowBrands />} />
        <Route path="/onboarding/profile" element={<CreateProfile />} />

        <Route element={<RequireOnboarding />}>
          <Route path="/app" element={<MainNavLayout />}>
            <Route index element={<Home />} />
            <Route path="saved" element={<SavedPosts />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="spaces/:spaceId" element={<SpaceDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:chatId" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            <Route path="u/:username" element={<UserProfile />} />
            <Route path="profile/my-rig" element={<MyRig />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="gear/search" element={<GearSearchScreen />} />
            <Route path="gear/custom" element={<CustomGearScreen />} />
            <Route path="gear/:gearId" element={<GearProductScreen />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
