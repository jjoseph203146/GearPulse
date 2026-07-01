import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { supabase } from "@/lib/supabase";
import { fetchRig } from "@/features/gear/data";
import { startConversation } from "@/features/messages/data";
import { useAuth } from "@/hooks/useAuth";
import type { Profile, RigItem } from "@/types";

export function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [rig, setRig] = useState<RigItem[]>([]);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    if (!username) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [username]);

  useEffect(() => {
    if (!profile) return;
    fetchRig(profile.id).then(setRig);
  }, [profile]);

  async function handleMessage() {
    if (!profile || messaging) return;
    setMessaging(true);
    try {
      const conversationId = await startConversation(profile.id);
      navigate(`/app/messages/${conversationId}`);
    } finally {
      setMessaging(false);
    }
  }

  if (profile === undefined) return <div className="min-h-screen bg-[#09090b]" />;

  if (profile === null) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <p className="text-[#a1a1aa]">User not found</p>
        <MaterialIcon name="arrow_back" size={24} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center gap-3 px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <MaterialIcon name="arrow_back" size={22} color="#fafafa" className="cursor-pointer" onClick={() => navigate(-1)} />
        <span className="text-[17px] font-extrabold tracking-[-.01em]">@{profile.username}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="gp-grad w-[88px] h-[88px] rounded-full flex items-center justify-center text-4xl flex-none overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.avatar_emoji ?? "🎵"
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[22px] font-extrabold tracking-[-.02em]">{profile.display_name}</h2>
              {profile.verified && <MaterialIcon name="verified" size={20} color="#3b82f6" filled />}
            </div>
            <p className="text-sm text-[#a1a1aa] mt-0.5">@{profile.username}</p>
          </div>
        </div>
        {profile.bio && <p className="text-[14.5px] leading-[1.5] text-[#f4f4f5] mb-5">{profile.bio}</p>}
        {user && user.id !== profile.id && (
          <button
            onClick={handleMessage}
            disabled={messaging}
            className="gp-grad w-full h-11 rounded-[12px] border-none text-white text-sm font-bold cursor-pointer font-sans mb-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <MaterialIcon name="chat_bubble" size={17} color="#fff" />
            Message
          </button>
        )}

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-[#d4d4d8]">Rig</h3>
          <span className="text-[13px] text-[#71717a]">{rig.length} pieces</span>
        </div>
        {rig.length === 0 ? (
          <p className="text-sm text-[#52525b] py-6 text-center">No gear listed yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {rig.map((g) => (
              <div
                key={g.id}
                onClick={() => g.refId && navigate(`/app/gear/${g.refId}`)}
                className={`flex items-center gap-3 p-3 rounded-xl border border-[#27272a] bg-[rgba(24,24,27,.5)] ${g.refId ? "cursor-pointer" : ""}`}
              >
                <div className="w-[54px] h-[54px] rounded-xl overflow-hidden bg-[#27272a] flex-none">
                  {g.image && <img src={g.image} alt="" className="w-full h-full object-cover" loading="lazy" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px]">{g.emoji}</span>
                    <span className="text-[11.5px] text-[#71717a]">{g.type}</span>
                  </div>
                  <div className="text-sm font-bold mt-px">{g.name}</div>
                </div>
                {g.refId && <MaterialIcon name="chevron_right" size={20} color="#3f3f46" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
