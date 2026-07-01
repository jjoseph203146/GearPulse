import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";
import { fetchRig } from "@/features/gear/data";
import { deletePost, fetchPostsByAuthor } from "@/features/feed/data";
import type { Post, RigItem } from "@/types";
import { cn } from "@/lib/utils";

const TABS = ["Posts", "My Rig", "Awards"];

export function Profile() {
  const navigate = useNavigate();
  const { profileTab, setProfileTab } = useAppState();
  const { user } = useAuth();
  const [rig, setRig] = useState<RigItem[]>([]);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchRig(user.id).then(setRig);
    fetchPostsByAuthor(user.id, user.id).then(setPosts);
  }, [user]);

  async function handleDeletePost(postId: string) {
    if (!user) return;
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setDeletingId(postId);
    try {
      await deletePost(postId, user.id);
      setPosts((prev) => prev?.filter((p) => p.id !== postId) ?? null);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <h1 className="text-xl font-extrabold tracking-[-.02em]">Profile</h1>
        <div className="flex items-center gap-3">
          <MaterialIcon name="add_box" size={24} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/create-post")} />
          <MaterialIcon name="settings" size={24} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/settings")} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="gp-grad w-[88px] h-[88px] rounded-full flex items-center justify-center text-4xl flex-none">
            👨‍🎤
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em]">Jacob Rivera</h2>
            <p className="text-sm text-[#a1a1aa] mt-0.5">@jacobr</p>
            <div className="flex gap-[18px] mt-3">
              <div>
                <span className="text-[15px] font-bold">1,234</span>
                <span className="text-[13px] text-[#a1a1aa]"> followers</span>
              </div>
              <div>
                <span className="text-[15px] font-bold">567</span>
                <span className="text-[13px] text-[#a1a1aa]"> following</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[14.5px] leading-[1.5] text-[#f4f4f5] mb-3">
          Keyboard player &amp; producer 🎹 Building my dream studio one piece at a time
        </p>
        <div className="flex gap-[18px] text-[#a1a1aa] mb-5">
          <div className="flex items-center gap-1.5">
            <MaterialIcon name="location_on" size={17} />
            <span className="text-[13.5px]">Los Angeles, CA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MaterialIcon name="calendar_today" size={17} />
            <span className="text-[13.5px]">Joined June 2026</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate("/app/profile/my-rig")}
            className="gp-grad h-11 rounded-[11px] border-none text-white text-[14.5px] font-bold cursor-pointer font-sans flex items-center justify-center gap-[7px]"
          >
            <MaterialIcon name="inventory_2" size={19} />
            My Rig
          </button>
          <button
            onClick={() => navigate("/app/profile/edit")}
            className="h-11 rounded-[11px] bg-transparent border border-[#3f3f46] text-[#fafafa] text-[14.5px] font-semibold cursor-pointer font-sans"
          >
            Edit Profile
          </button>
        </div>
        <div className="flex gap-1.5 bg-[#18181b] border border-[#27272a] rounded-xl p-[5px] mb-[18px]">
          {TABS.map((label) => {
            const active = profileTab === label;
            return (
              <div
                key={label}
                onClick={() => setProfileTab(label)}
                className={cn(
                  "flex-1 text-center py-2 px-1 rounded-lg text-[13.5px] font-semibold cursor-pointer",
                  active ? "text-[#fafafa] bg-[#27272a]" : "text-[#71717a] bg-transparent",
                )}
              >
                {label}
              </div>
            );
          })}
        </div>

        {profileTab === "Posts" && (
          <>
            {posts === null && <p className="text-center text-sm text-[#71717a] py-10">Loading…</p>}
            {posts !== null && posts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-[18px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon name="dynamic_feed" size={32} color="#3f3f46" />
                </div>
                <p className="text-[15px] font-bold text-[#a1a1aa] mb-1">No posts yet</p>
                <button
                  onClick={() => navigate("/app/create-post")}
                  className="gp-grad mt-4 h-10 px-5 rounded-[11px] border-none text-white text-[13.5px] font-bold cursor-pointer font-sans"
                >
                  Create your first post
                </button>
              </div>
            )}
            {posts !== null && posts.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {posts.map((post) => (
                  <div key={post.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#18181b] border border-[#27272a]">
                    {post.image_url ? (
                      <img src={post.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <p className="p-3 text-[12.5px] leading-[1.4] text-[#d4d4d8] line-clamp-6">{post.content}</p>
                    )}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingId === post.id}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer border-none disabled:opacity-50"
                    >
                      <MaterialIcon name="delete" size={15} color="#fafafa" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {profileTab === "My Rig" && (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13.5px] text-[#71717a] whitespace-nowrap">{rig.length} pieces of gear</span>
              <span
                onClick={() => navigate("/app/gear/search")}
                className="flex items-center gap-[5px] text-[12.5px] font-semibold text-[#60a5fa] cursor-pointer whitespace-nowrap"
              >
                <MaterialIcon name="add" size={15} />
                Add gear
              </span>
            </div>
            <div className="flex flex-col gap-2 mb-3.5">
              {rig.map((g) => (
                <div
                  key={g.id}
                  onClick={() => navigate(`/app/gear/${g.id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
                >
                  <div className="w-[54px] h-[54px] rounded-xl overflow-hidden bg-[#27272a] flex-none">
                    <img src={g.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px]">{g.emoji}</span>
                      <span className="text-[11.5px] text-[#71717a]">{g.type}</span>
                    </div>
                    <div className="text-sm font-bold mt-px">{g.name}</div>
                    <div className="text-[11px] text-[#52525b] mt-px">Since {g.year}</div>
                  </div>
                  <MaterialIcon name="chevron_right" size={20} color="#3f3f46" />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/app/profile/my-rig")}
              className="w-full p-3 rounded-xl bg-transparent border border-[#27272a] text-[#60a5fa] text-[13.5px] font-semibold cursor-pointer font-sans"
            >
              View full rig →
            </button>
          </>
        )}

        {profileTab === "Awards" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-[18px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto mb-4">
              <MaterialIcon name="trophy" size={32} color="#3f3f46" />
            </div>
            <p className="text-[15px] font-bold text-[#a1a1aa] mb-1">No awards yet</p>
            <p className="text-[13px] text-[#52525b]">Keep creating and sharing your gear</p>
          </div>
        )}
      </div>
    </div>
  );
}
