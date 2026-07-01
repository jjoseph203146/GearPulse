import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { NoSearchResults } from "@/components/NoSearchResults";
import { GearCardSkeleton, PostSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { searchPosts, searchProfiles, fetchSuggestedProfiles } from "./data";
import { searchGear } from "@/features/gear/data";
import { searchSpaces } from "@/features/spaces/data";
import { PostCard } from "@/features/feed/PostCard";
import { toggleLike, toggleSave } from "@/features/feed/data";
import type { GearListItem, Post, PostAuthor, SpaceListItem } from "@/types";

const TABS = ["Posts", "People", "Gear", "Spaces"] as const;
type Tab = (typeof TABS)[number];

export function Search() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tab, setTab] = useState<Tab>("Posts");
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [people, setPeople] = useState<PostAuthor[] | null>(null);
  const [gear, setGear] = useState<GearListItem[] | null>(null);
  const [spaces, setSpaces] = useState<SpaceListItem[] | null>(null);

  const [suggested, setSuggested] = useState<PostAuthor[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchSuggestedProfiles(user.id).then(setSuggested);
  }, [user]);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    if (!user) return;
    if (!debounced) {
      setPosts(null);
      setPeople(null);
      setGear(null);
      setSpaces(null);
      return;
    }
    setLoading(true);
    Promise.all([
      searchPosts(debounced, user.id).then(setPosts),
      searchProfiles(debounced, user.id).then(setPeople),
      searchGear(debounced, "all").then(setGear),
      searchSpaces(debounced, user.id).then(setSpaces),
    ]).finally(() => setLoading(false));
  }, [debounced, user]);

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

  const hasQuery = debounced.length > 0;
  const activeCount =
    tab === "Posts" ? posts?.length : tab === "People" ? people?.length : tab === "Gear" ? gear?.length : spaces?.length;
  const noResults = hasQuery && !loading && activeCount === 0;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] p-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="relative">
          <MaterialIcon name="search" size={21} color="#71717a" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, people, gear, spaces"
            className="w-full h-12 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] pl-11 pr-4 text-[15px] outline-none placeholder:text-[#71717a]"
          />
        </div>
        {hasQuery && (
          <div className="flex gap-1.5 bg-[#18181b] border border-[#27272a] rounded-xl p-[5px] mt-3">
            {TABS.map((t) => (
              <div
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 text-center py-2 px-1 rounded-lg text-[13.5px] font-semibold cursor-pointer ${
                  tab === t ? "text-[#fafafa] bg-[#27272a]" : "text-[#71717a] bg-transparent"
                }`}
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {!hasQuery ? (
        <div className="px-4 pt-5 pb-6">
          <h2 className="text-[19px] font-extrabold mb-4">Suggested people</h2>
          <div className="flex flex-col gap-3">
            {suggested.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/app/u/${p.username}`)}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
              >
                <div className="gp-grad w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                  {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.avatar_emoji ?? "🎵"}
                </div>
                <div>
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[15px] font-bold">{p.display_name}</span>
                    {p.verified && <MaterialIcon name="verified" size={15} color="#3b82f6" filled />}
                  </div>
                  <div className="text-[13px] text-[#71717a]">@{p.username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : noResults ? (
        <NoSearchResults query={debounced} />
      ) : (
        <div className="px-4 pt-5 pb-6">
          {tab === "Posts" && (
            <>
              {posts === null ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : (
                <div className="flex flex-col -mx-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "People" && (
            <div className="flex flex-col gap-3">
              {people === null
                ? Array.from({ length: 3 }).map((_, i) => <GearCardSkeleton key={i} />)
                : people.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/app/u/${p.username}`)}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
                    >
                      <div className="gp-grad w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                        {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.avatar_emoji ?? "🎵"}
                      </div>
                      <div>
                        <div className="flex items-center gap-[5px]">
                          <span className="text-[15px] font-bold">{p.display_name}</span>
                          {p.verified && <MaterialIcon name="verified" size={15} color="#3b82f6" filled />}
                        </div>
                        <div className="text-[13px] text-[#71717a]">@{p.username}</div>
                      </div>
                    </div>
                  ))}
            </div>
          )}

          {tab === "Gear" && (
            <div className="space-y-2">
              {gear === null
                ? Array.from({ length: 3 }).map((_, i) => <GearCardSkeleton key={i} />)
                : gear.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => navigate(`/app/gear/${g.id}`)}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-[13px] overflow-hidden bg-[#27272a] flex-none flex items-center justify-center text-2xl">
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
          )}

          {tab === "Spaces" && (
            <div className="flex flex-col gap-3">
              {spaces === null
                ? Array.from({ length: 3 }).map((_, i) => <GearCardSkeleton key={i} />)
                : spaces.map((sp) => (
                    <div
                      key={sp.id}
                      onClick={() => navigate(`/app/spaces/${sp.id}`)}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
                    >
                      <div
                        className="w-12 h-12 rounded-[13px] flex items-center justify-center text-2xl border border-[#3f3f46]"
                        style={{ background: sp.gradient ?? "linear-gradient(135deg,#27272a,#18181b)" }}
                      >
                        {sp.emoji}
                      </div>
                      <div>
                        <div className="text-[15px] font-bold">{sp.name}</div>
                        <div className="flex items-center gap-1.5 text-[#71717a] mt-0.5">
                          <MaterialIcon name="group" size={14} />
                          <span className="text-[13px]">{sp.memberCount.toLocaleString()} members</span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
