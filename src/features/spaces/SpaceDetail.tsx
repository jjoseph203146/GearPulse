import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAppState } from "@/hooks/useAppState";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { fetchSpaceById, fetchTrendingGearInSpace, joinSpace, leaveSpace } from "./data";
import { fetchPostsBySpace, toggleLike, toggleSave } from "@/features/feed/data";
import { PostCard } from "@/features/feed/PostCard";
import type { GearListItem, Post, SpaceListItem } from "@/types";

const TABS = ["Posts", "Gear", "News", "Creators"];

export function SpaceDetail() {
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();
  const { user } = useAuth();
  const { spaceTab, setSpaceTab } = useAppState();
  const [space, setSpace] = useState<SpaceListItem | null | undefined>(undefined);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [trendingGear, setTrendingGear] = useState<GearListItem[] | null>(null);

  const loadSpace = useCallback(async () => {
    if (!user || !spaceId) return;
    setSpace(await fetchSpaceById(spaceId, user.id));
  }, [user, spaceId]);

  useEffect(() => {
    loadSpace();
  }, [loadSpace]);

  useEffect(() => {
    if (!user || !spaceId || spaceTab !== "Posts") return;
    fetchPostsBySpace(spaceId, user.id).then(setPosts);
  }, [user, spaceId, spaceTab]);

  useEffect(() => {
    if (!spaceId || spaceTab !== "Gear" || trendingGear !== null) return;
    fetchTrendingGearInSpace(spaceId).then(setTrendingGear);
  }, [spaceId, spaceTab, trendingGear]);

  async function handleToggleJoin() {
    if (!user || !space) return;
    const wasJoined = space.joined;
    setSpace({ ...space, joined: !wasJoined, memberCount: space.memberCount + (wasJoined ? -1 : 1) });
    if (wasJoined) await leaveSpace(space.id, user.id);
    else await joinSpace(space.id, user.id);
  }

  async function handleToggleLike(post: Post) {
    if (!user) return;
    setPosts((prev) =>
      prev?.map((p) =>
        p.id === post.id ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) } : p,
      ) ?? prev,
    );
    await toggleLike(post.id, user.id, post.liked_by_me);
  }

  async function handleToggleSave(post: Post) {
    if (!user) return;
    setPosts((prev) => prev?.map((p) => (p.id === post.id ? { ...p, saved_by_me: !p.saved_by_me } : p)) ?? prev);
    await toggleSave(post.id, user.id, post.saved_by_me);
  }

  if (space === undefined) return <div className="min-h-screen bg-[#09090b]" />;

  if (space === null) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <p className="text-[#a1a1aa]">Space not found</p>
      </div>
    );
  }

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <MaterialIcon name="arrow_back" size={25} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/spaces")} />
        <div className="flex gap-3.5">
          <MaterialIcon name="notifications" size={22} color="#a1a1aa" className="cursor-pointer" onClick={() => navigate("/app/notifications")} />
          <MaterialIcon name="share" size={22} color="#a1a1aa" className="cursor-pointer" />
        </div>
      </div>
      <div className="relative h-[150px]" style={{ background: space.gradient ?? "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
        {space.image && (
          <div className="absolute inset-0 opacity-30">
            <img src={space.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
      </div>
      <div className="px-4 -mt-12 relative">
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-[22px]">
          <div className="flex items-center gap-2">
            <h1 className="text-[23px] font-extrabold tracking-[-.02em]">{space.name}</h1>
            {!space.isPublic && <MaterialIcon name="lock" size={18} color="#71717a" />}
          </div>
          <div className="flex items-center gap-[7px] text-[#a1a1aa] my-2.5">
            <MaterialIcon name="group" size={18} />
            <span className="text-sm">{space.memberCount.toLocaleString()} members</span>
          </div>
          <p className="text-sm leading-[1.55] text-[#d4d4d8]">{space.description}</p>
          <button
            onClick={handleToggleJoin}
            className={cn(
              "mt-4 w-full h-12 rounded-xl border-none text-white text-[15px] font-bold cursor-pointer font-sans",
              !space.joined && "gp-grad",
            )}
            style={space.joined ? { background: "#27272a" } : undefined}
          >
            {space.joined ? "Leave Space" : "Join Space"}
          </button>
        </div>
        <div className="flex gap-1.5 bg-[#18181b] border border-[#27272a] rounded-xl p-[5px] mt-[22px]">
          {TABS.map((label) => {
            const active = spaceTab === label;
            return (
              <div
                key={label}
                onClick={() => setSpaceTab(label)}
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
        <div className="py-[18px] pb-6">
          {spaceTab === "Posts" && (
            <>
              {posts === null && <p className="text-center text-sm text-[#52525b] py-8">Loading posts…</p>}
              {posts?.length === 0 && (
                <p className="text-center text-sm text-[#52525b] py-8">No posts in this space yet.</p>
              )}
              <div className="flex flex-col -mx-4">
                {posts?.map((post) => (
                  <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
                ))}
              </div>
            </>
          )}
          {spaceTab === "Gear" && (
            <>
              {trendingGear === null && <p className="text-center text-sm text-[#52525b] py-8">Loading trending gear…</p>}
              {trendingGear?.length === 0 && (
                <p className="text-center text-sm text-[#52525b] py-8">No gear tagged in this space yet.</p>
              )}
              <div className="flex flex-col gap-2">
                {trendingGear?.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => navigate(`/app/gear/${g.id}`)}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#27272a] flex-none flex items-center justify-center text-2xl">
                      {g.image ? <img src={g.image} alt="" className="w-full h-full object-cover" /> : g.categoryEmoji}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold">{g.name}</div>
                      <div className="text-[13px] text-[#71717a]">
                        {g.brand} · {g.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {spaceTab === "News" && (
            <div className="text-center py-12 text-[#71717a] text-sm">Latest news coming soon</div>
          )}
          {spaceTab === "Creators" && (
            <div className="text-center py-12 text-[#71717a] text-sm">Featured creators coming soon</div>
          )}
        </div>
      </div>
    </div>
  );
}
