import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/features/onboarding/OnboardingHeader";
import { MaterialIcon } from "@/components/MaterialIcon";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full h-12 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 text-[15px] outline-none placeholder:text-[#52525b]";

export function CreateProfile() {
  const navigate = useNavigate();
  const { puUsername, setPuUsername, puDisplay, setPuDisplay, types, instruments, interests, follows } =
    useAppState();
  const { user, profile, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const ready = !!(puUsername.trim() && puDisplay.trim());

  async function complete() {
    if (!ready || submitting || !user) return;
    setSubmitting(true);
    setError(null);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: puUsername.trim().replace(/^@/, ""),
        display_name: puDisplay.trim(),
        account_type: types[0] ?? null,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (profileError) {
      setSubmitting(false);
      setError(
        profileError.code === "23505" ? "That username is already taken." : profileError.message,
      );
      return;
    }

    await Promise.all([
      instruments.length &&
        supabase.from("profile_instruments").upsert(
          instruments.map((instrument_id) => ({ user_id: user.id, instrument_id })),
          { onConflict: "user_id,instrument_id" },
        ),
      interests.length &&
        supabase.from("space_members").upsert(
          interests.map((space_id) => ({ user_id: user.id, space_id })),
          { onConflict: "space_id,user_id" },
        ),
      follows.length &&
        supabase.from("brand_follows").upsert(
          follows.map((brand_id) => ({ user_id: user.id, brand_id })),
          { onConflict: "user_id,brand_id" },
        ),
    ]);

    await refreshProfile();
    setSubmitting(false);
    navigate("/app");
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-10">
      <OnboardingHeader back="/onboarding/brands" step={5} />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em]">Create your profile</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-7">Tell the community about yourself</p>
      <div className="flex flex-col items-center mb-7">
        <AvatarUpload avatarUrl={profile?.avatar_url} fallbackEmoji="🎤" size={96} />
      </div>
      <div className="flex flex-col gap-[18px]">
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Username *</label>
          <input
            value={puUsername}
            onChange={(e) => setPuUsername(e.target.value)}
            placeholder="@yourname"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Display Name *</label>
          <input
            value={puDisplay}
            onChange={(e) => setPuDisplay(e.target.value)}
            placeholder="Your Name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Bio</label>
          <textarea
            placeholder="Tell us about yourself..."
            className="w-full h-20 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 py-3 text-[15px] outline-none resize-none placeholder:text-[#52525b]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Location</label>
          <div className="relative">
            <MaterialIcon
              name="location_on"
              size={20}
              color="#71717a"
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input placeholder="City, Country" className={`${inputClass} pl-[42px]`} />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">My Rig</label>
          <textarea
            placeholder={"List your gear, e.g.:\nYamaha CK88\nFocusrite Interface\nShure Microphone"}
            className="w-full h-[104px] rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 py-3 text-[15px] outline-none resize-none placeholder:text-[#52525b]"
          />
        </div>
      </div>
      {error && <p className="text-[13px] text-[#f87171] text-center mt-4">{error}</p>}
      <button
        onClick={complete}
        disabled={!ready || submitting}
        className="mt-7 w-full h-[54px] border-none rounded-[14px] text-base font-bold cursor-pointer font-sans"
        style={{
          background: ready && !submitting ? "linear-gradient(135deg,#2563eb,#3b82f6)" : "#27272a",
          color: ready && !submitting ? "#fff" : "#52525b",
        }}
      >
        {submitting ? "Saving…" : "Complete Setup"}
      </button>
      {!ready && (
        <p className="text-[11.5px] text-[#52525b] text-center mt-2.5">
          Username and display name are required to continue
        </p>
      )}
    </div>
  );
}
