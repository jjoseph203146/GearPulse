import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";
import { addComment, fetchComments } from "./data";
import type { Post, PostComment } from "@/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface PostCardProps {
  post: Post;
  onToggleLike: (post: Post) => void;
  onToggleSave: (post: Post) => void;
}

export function PostCard({ post, onToggleLike, onToggleSave }: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count);

  async function toggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && comments === null) {
      setLoadingComments(true);
      try {
        setComments(await fetchComments(post.id));
      } finally {
        setLoadingComments(false);
      }
    }
  }

  async function submitComment() {
    if (!user || !commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const created = await addComment(post.id, user.id, commentText.trim());
      setComments((prev) => [created, ...(prev ?? [])]);
      setCommentCount((c) => c + 1);
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  }

  const author = post.author;

  return (
    <div className="border-b border-[#27272a]">
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="gp-grad w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-none overflow-hidden">
            {author.avatar_url ? (
              <img src={author.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              author.avatar_emoji ?? "🎵"
            )}
          </div>
          <div>
            <div className="flex items-center gap-[5px]">
              <span className="text-[15px] font-bold">{author.display_name}</span>
              {author.verified && <MaterialIcon name="verified" size={16} color="#3b82f6" filled />}
            </div>
            <div className="text-[13px] text-[#71717a]">@{author.username}</div>
            <div className="text-[11.5px] text-[#52525b] mt-px whitespace-nowrap">{timeAgo(post.created_at)}</div>
          </div>
        </div>
        <MaterialIcon name="more_horiz" size={22} color="#a1a1aa" className="cursor-pointer" />
      </div>
      <div className="px-4 pb-3">
        <p className="text-[14.5px] leading-[1.5] text-[#f4f4f5]">{post.content}</p>
      </div>
      {post.gear.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.gear.map((g) => (
            <div
              key={g.id}
              onClick={() => g.refId && navigate(`/app/gear/${g.refId}`)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#27272a] border border-[#3f3f46] text-[12px] text-[#d4d4d8] ${g.refId ? "cursor-pointer" : ""}`}
            >
              <span>{g.emoji}</span>
              <span>{g.name}</span>
            </div>
          ))}
        </div>
      )}
      {post.video_url ? (
        <div className="w-full aspect-video bg-[#18181b] overflow-hidden">
          <video src={post.video_url} controls playsInline className="w-full h-full object-cover" />
        </div>
      ) : (
        post.image_url && (
          <div className="w-full aspect-video bg-[#18181b] overflow-hidden">
            <img src={post.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <div onClick={() => onToggleLike(post)} className="flex items-center gap-[7px] cursor-pointer">
            <MaterialIcon
              name="favorite"
              size={23}
              color={post.liked_by_me ? "#ec4899" : "#a1a1aa"}
              filled={post.liked_by_me}
            />
            <span className="text-[13.5px] text-[#a1a1aa]">{post.like_count}</span>
          </div>
          <div onClick={toggleComments} className="flex items-center gap-[7px] cursor-pointer">
            <MaterialIcon name="mode_comment" size={23} color={showComments ? "#60a5fa" : "#a1a1aa"} />
            <span className="text-[13.5px] text-[#a1a1aa]">{commentCount}</span>
          </div>
          <MaterialIcon name="share" size={23} color="#a1a1aa" className="cursor-pointer" />
        </div>
        <MaterialIcon
          name="bookmark"
          size={23}
          color={post.saved_by_me ? "#3b82f6" : "#a1a1aa"}
          filled={post.saved_by_me}
          onClick={() => onToggleSave(post)}
        />
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Add a comment…"
              className="flex-1 h-10 rounded-full bg-[#18181b] border border-[#27272a] px-4 text-[13.5px] text-[#fafafa] outline-none placeholder:text-[#52525b]"
            />
            <button
              onClick={submitComment}
              disabled={!commentText.trim() || submitting}
              className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center cursor-pointer disabled:opacity-40 border-none"
            >
              <MaterialIcon name="send" size={17} color="#60a5fa" />
            </button>
          </div>
          {loadingComments && <p className="text-[13px] text-[#52525b]">Loading comments…</p>}
          {!loadingComments && comments?.length === 0 && (
            <p className="text-[13px] text-[#52525b]">No comments yet. Be the first!</p>
          )}
          <div className="flex flex-col gap-3">
            {comments?.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-sm flex-none overflow-hidden">
                  {c.author.avatar_url ? (
                    <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    c.author.avatar_emoji ?? "🎵"
                  )}
                </div>
                <div>
                  <div className="text-[12.5px]">
                    <span className="font-bold">{c.author.display_name}</span>{" "}
                    <span className="text-[#d4d4d8]">{c.content}</span>
                  </div>
                  <div className="text-[11px] text-[#52525b] mt-0.5">{timeAgo(c.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
