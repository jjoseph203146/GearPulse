import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";
import { createPost, tagPostGear } from "@/features/feed/data";
import { fetchRig } from "@/features/gear/data";
import { fetchSpaces } from "@/features/spaces/data";
import type { RigItem, SpaceListItem } from "@/types";

export function CreatePost() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [text, setText] = useState("");
  const [spaces, setSpaces] = useState<SpaceListItem[]>([]);
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [showSpacePicker, setShowSpacePicker] = useState(false);
  const [rig, setRig] = useState<RigItem[]>([]);
  const [showGearPicker, setShowGearPicker] = useState(false);
  const [taggedGear, setTaggedGear] = useState<RigItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchSpaces(user.id).then((all) => setSpaces(all.filter((s) => s.joined)));
    fetchRig(user.id).then(setRig);
  }, [user]);

  function toggleGearTag(item: RigItem) {
    setTaggedGear((prev) => (prev.some((g) => g.id === item.id) ? prev.filter((g) => g.id !== item.id) : [...prev, item]));
  }

  async function handlePost() {
    if (!user || !text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const postId = await createPost(user.id, text.trim(), spaceId, null);
      await tagPostGear(
        postId,
        taggedGear.map((g) => ({ gearId: g.isCustom ? null : g.refId, customGearId: g.isCustom ? g.id : null })),
      );
      navigate("/app");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSpace = spaces.find((s) => s.id === spaceId);

  return (
    <div className="flex flex-col max-w-screen-md mx-auto h-[calc(100vh-env(safe-area-inset-top))]">
      <div className="flex-none flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <span onClick={() => navigate("/app")} className="text-[15px] font-semibold text-[#a1a1aa] cursor-pointer">
          Cancel
        </span>
        <span className="text-base font-extrabold">New Post</span>
        <button
          onClick={handlePost}
          disabled={!text.trim() || submitting}
          className="gp-grad h-9 px-[18px] rounded-[10px] border-none text-white text-[13.5px] font-bold cursor-pointer font-sans disabled:opacity-40"
        >
          {submitting ? "Posting…" : "Post"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-3 mb-3.5">
          <div className="gp-grad w-[46px] h-[46px] rounded-full flex items-center justify-center text-2xl flex-none overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              profile?.avatar_emoji ?? "🎵"
            )}
          </div>
          <div>
            <div className="text-[15px] font-bold">{profile?.display_name}</div>
            <div
              onClick={() => setShowSpacePicker((v) => !v)}
              className="inline-flex items-center gap-[5px] mt-1 px-[11px] py-1 rounded-full bg-[#27272a] border border-[#3f3f46] text-[11.5px] text-[#d4d4d8] cursor-pointer"
            >
              <MaterialIcon name="tag" size={14} color="#60a5fa" />
              {selectedSpace ? selectedSpace.name : "No space"}
              <MaterialIcon name="expand_more" size={15} color="#71717a" />
            </div>
          </div>
        </div>

        {showSpacePicker && (
          <div className="mb-3.5 p-3 rounded-2xl border border-[#27272a] bg-[#18181b] flex flex-col gap-1.5">
            <div
              onClick={() => {
                setSpaceId(null);
                setShowSpacePicker(false);
              }}
              className="px-3 py-2 rounded-lg text-[13.5px] text-[#a1a1aa] cursor-pointer hover:bg-[#27272a]"
            >
              No space
            </div>
            {spaces.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSpaceId(s.id);
                  setShowSpacePicker(false);
                }}
                className="px-3 py-2 rounded-lg text-[13.5px] text-[#fafafa] cursor-pointer hover:bg-[#27272a] flex items-center gap-2"
              >
                <span>{s.emoji}</span>
                {s.name}
              </div>
            ))}
            {spaces.length === 0 && <p className="px-3 py-2 text-[13px] text-[#52525b]">Join a space first to post there.</p>}
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="Share an update, ask a question, or show off your gear..."
          className="w-full min-h-[148px] border-none bg-transparent text-[#fafafa] text-base leading-[1.55] outline-none resize-none placeholder:text-[#52525b]"
        />

        {taggedGear.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {taggedGear.map((g) => (
              <div
                key={g.id}
                onClick={() => toggleGearTag(g)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#27272a] border border-[#3f3f46] text-[12px] text-[#d4d4d8] cursor-pointer"
              >
                <span>{g.emoji}</span>
                <span>{g.name}</span>
                <MaterialIcon name="close" size={13} color="#71717a" />
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => setShowGearPicker((v) => !v)}
          className="flex items-center gap-3 mt-4 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
        >
          <MaterialIcon name="inventory_2" size={22} color="#60a5fa" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Tag gear from your rig</div>
            <div className="text-[11.5px] text-[#71717a] mt-px">Let others discover what you use</div>
          </div>
          <MaterialIcon name={showGearPicker ? "expand_less" : "chevron_right"} size={20} color="#3f3f46" />
        </div>

        {showGearPicker && (
          <div className="mt-2 p-2 rounded-2xl border border-[#27272a] bg-[#18181b] flex flex-col gap-1">
            {rig.length === 0 && <p className="px-3 py-3 text-[13px] text-[#52525b]">Your rig is empty.</p>}
            {rig.map((g) => {
              const selected = taggedGear.some((t) => t.id === g.id);
              return (
                <div
                  key={g.id}
                  onClick={() => toggleGearTag(g)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer ${selected ? "bg-[rgba(168,85,247,.1)]" : "hover:bg-[#27272a]"}`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#27272a] flex items-center justify-center text-lg flex-none">
                    {g.image ? <img src={g.image} alt="" className="w-full h-full object-cover" /> : g.emoji}
                  </div>
                  <span className="flex-1 text-[13.5px] text-[#fafafa]">{g.name}</span>
                  {selected && <MaterialIcon name="check" size={18} color="#a855f7" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex-none flex items-center gap-[22px] px-4 pt-3.5 pb-[22px] border-t border-[#27272a] bg-[#18181b]">
        <MaterialIcon name="image" size={24} color="#a1a1aa" className="cursor-pointer" />
        <MaterialIcon name="photo_camera" size={24} color="#a1a1aa" className="cursor-pointer" />
        <MaterialIcon name="tag" size={24} color="#a1a1aa" className="cursor-pointer" onClick={() => setShowGearPicker((v) => !v)} />
        <span className="ml-auto text-xs text-[#52525b]">{text.length} / 500</span>
      </div>
    </div>
  );
}
