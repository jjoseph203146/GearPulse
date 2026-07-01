import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { feedData } from "./data";
import { useAppState } from "@/hooks/useAppState";
import { EmptyFeed } from "./EmptyFeed";

export function Home() {
  const navigate = useNavigate();
  const { likedPosts, toggleLike, savedPosts, toggleSave } = useAppState();

  if (feedData.length === 0) return <EmptyFeed />;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center gap-2.5">
          <div className="gp-grad w-[34px] h-[34px] rounded-[10px] flex items-center justify-center">
            <MaterialIcon name="podcasts" size={21} color="#fff" filled />
          </div>
          <span className="gp-word font-extrabold text-[21px] tracking-[-.02em]">GearPulse</span>
        </div>
        <div className="flex gap-1.5">
          <div
            onClick={() => navigate("/app/notifications")}
            className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer"
          >
            <MaterialIcon name="notifications" size={24} color="#a1a1aa" />
            <div className="absolute top-2 right-[9px] w-2 h-2 rounded-full bg-[#ec4899]" />
          </div>
          <div
            onClick={() => navigate("/app/messages")}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <MaterialIcon name="chat_bubble" size={24} color="#a1a1aa" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {feedData.map((post) => {
          const liked = likedPosts.includes(post.id);
          const saved = savedPosts.includes(post.id);
          return (
            <div key={post.id} className="border-b border-[#27272a]">
              <div className="flex items-start justify-between px-4 pt-4 pb-3">
                <div className="flex items-start gap-3">
                  <div className="gp-grad w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-none">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-[5px]">
                      <span className="text-[15px] font-bold">{post.author}</span>
                      {post.verified && <MaterialIcon name="verified" size={16} color="#3b82f6" filled />}
                    </div>
                    <div className="text-[13px] text-[#71717a]">{post.username}</div>
                    <div className="text-[11.5px] text-[#52525b] mt-px whitespace-nowrap">{post.meta}</div>
                  </div>
                </div>
                <MaterialIcon name="more_horiz" size={22} color="#a1a1aa" className="cursor-pointer" />
              </div>
              <div className="px-4 pb-3">
                <p className="text-[14.5px] leading-[1.5] text-[#f4f4f5]">{post.content}</p>
              </div>
              {post.img && (
                <div className="w-full aspect-video bg-[#18181b] overflow-hidden">
                  <img src={post.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-6">
                  <div onClick={() => toggleLike(post.id)} className="flex items-center gap-[7px] cursor-pointer">
                    <MaterialIcon name="favorite" size={23} color={liked ? "#ec4899" : "#a1a1aa"} filled={liked} />
                    <span className="text-[13.5px] text-[#a1a1aa]">{post.likes + (liked ? 1 : 0)}</span>
                  </div>
                  <div className="flex items-center gap-[7px] cursor-pointer">
                    <MaterialIcon name="mode_comment" size={23} color="#a1a1aa" />
                    <span className="text-[13.5px] text-[#a1a1aa]">{post.comments}</span>
                  </div>
                  <MaterialIcon name="share" size={23} color="#a1a1aa" className="cursor-pointer" />
                </div>
                <MaterialIcon
                  name="bookmark"
                  size={23}
                  color={saved ? "#a855f7" : "#a1a1aa"}
                  filled={saved}
                  onClick={() => toggleSave(post.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
