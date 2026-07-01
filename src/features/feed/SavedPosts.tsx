import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PostCard } from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchSavedPosts, toggleLike, toggleSave } from "./data";
import type { Post } from "@/types";

function SavedHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="sticky top-0 z-[4] flex items-center gap-3 px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
      <MaterialIcon name="arrow_back" size={22} color="#fafafa" className="cursor-pointer" onClick={onBack} />
      <span className="text-[17px] font-extrabold tracking-[-.01em]">Saved Posts</span>
    </div>
  );
}

function SavedSkeleton() {
  return (
    <div className="animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-b border-[#27272a] px-4 py-4">
          <div className="h-3 w-full bg-[#27272a] rounded" />
          <div className="h-3 w-2/3 bg-[#27272a] rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

function EmptySaved() {
  return (
    <div className="flex flex-col items-center text-center px-8 pt-14 pb-2">
      <div className="w-[84px] h-[84px] rounded-[24px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
        <MaterialIcon name="bookmark" size={40} color="#52525b" />
      </div>
      <h2 className="text-[21px] font-extrabold tracking-[-.01em]">Nothing saved yet</h2>
      <p className="text-sm text-[#a1a1aa] mt-2 leading-[1.5] max-w-[280px]" style={{ textWrap: "balance" }}>
        Tap the bookmark icon on any post to save it for later.
      </p>
    </div>
  );
}

export function SavedPosts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchSavedPosts(user.id).then(setPosts);
  }, [user]);

  const handleToggleLike = useCallback(
    (post: Post) => {
      if (!user) return;
      setPosts((prev) =>
        prev?.map((p) =>
          p.id === post.id
            ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) }
            : p,
        ) ?? null,
      );
      toggleLike(post.id, user.id, post.liked_by_me);
    },
    [user],
  );

  const handleToggleSave = useCallback(
    (post: Post) => {
      if (!user) return;
      setPosts((prev) => prev?.filter((p) => p.id !== post.id) ?? null);
      toggleSave(post.id, user.id, post.saved_by_me);
    },
    [user],
  );

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <SavedHeader onBack={() => navigate(-1)} />
      {posts === null ? (
        <SavedSkeleton />
      ) : posts.length === 0 ? (
        <EmptySaved />
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
