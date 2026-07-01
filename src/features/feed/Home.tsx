import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import logo from "@/assets/logo.png";
import { PostCard } from "./PostCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed, toggleLike, toggleSave } from "./data";
import type { Post } from "@/types";
import { EmptyFeed } from "./EmptyFeed";

function FeedHeader({
  onNotifications,
  onMessages,
  onSaved,
}: {
  onNotifications: () => void;
  onMessages: () => void;
  onSaved: () => void;
}) {
  return (
    <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
      <div className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-[10px] overflow-hidden">
          <img src={logo} alt="GearPulse" className="w-full h-full object-cover" />
        </div>
        <span className="gp-word font-extrabold text-[21px] tracking-[-.02em]">GearPulse</span>
      </div>
      <div className="flex gap-1.5">
        <div onClick={onSaved} className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer">
          <MaterialIcon name="bookmark" size={22} color="#a1a1aa" />
        </div>
        <div onClick={onNotifications} className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer">
          <MaterialIcon name="notifications" size={24} color="#a1a1aa" />
          <div className="absolute top-2 right-[9px] w-2 h-2 rounded-full bg-[#ec4899]" />
        </div>
        <div onClick={onMessages} className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer">
          <MaterialIcon name="chat_bubble" size={24} color="#a1a1aa" />
        </div>
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="gpfade max-w-screen-md mx-auto animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-b border-[#27272a] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#27272a]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-[#27272a] rounded" />
              <div className="h-2.5 w-1/4 bg-[#27272a] rounded" />
            </div>
          </div>
          <div className="h-3 w-full bg-[#27272a] rounded mt-4" />
          <div className="h-3 w-2/3 bg-[#27272a] rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchFeed(user.id).then(setPosts);
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
      setPosts((prev) => prev?.map((p) => (p.id === post.id ? { ...p, saved_by_me: !p.saved_by_me } : p)) ?? null);
      toggleSave(post.id, user.id, post.saved_by_me);
    },
    [user],
  );

  if (posts === null) return <FeedSkeleton />;
  if (posts.length === 0) return <EmptyFeed />;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <FeedHeader
        onNotifications={() => navigate("/app/notifications")}
        onMessages={() => navigate("/app/messages")}
        onSaved={() => navigate("/app/saved")}
      />
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
        ))}
      </div>
    </div>
  );
}
