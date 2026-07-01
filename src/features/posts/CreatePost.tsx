import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";

export function CreatePost() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-screen max-w-screen-md mx-auto">
      <div className="flex-none flex items-center justify-between px-4 py-3.5 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <span onClick={() => navigate("/app")} className="text-[15px] font-semibold text-[#a1a1aa] cursor-pointer">
          Cancel
        </span>
        <span className="text-base font-extrabold">New Post</span>
        <button
          onClick={() => navigate("/app")}
          className="gp-grad h-9 px-[18px] rounded-[10px] border-none text-white text-[13.5px] font-bold cursor-pointer font-sans"
        >
          Post
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-3 mb-3.5">
          <div className="gp-grad w-[46px] h-[46px] rounded-full flex items-center justify-center text-2xl flex-none">
            👨‍🎤
          </div>
          <div>
            <div className="text-[15px] font-bold">Jacob Rivera</div>
            <div className="inline-flex items-center gap-[5px] mt-1 px-[11px] py-1 rounded-full bg-[#27272a] border border-[#3f3f46] text-[11.5px] text-[#d4d4d8] cursor-pointer">
              <MaterialIcon name="tag" size={14} color="#c084fc" />
              Studio Space
              <MaterialIcon name="expand_more" size={15} color="#71717a" />
            </div>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="Share an update, ask a question, or show off your gear..."
          className="w-full min-h-[148px] border-none bg-transparent text-[#fafafa] text-base leading-[1.55] outline-none resize-none placeholder:text-[#52525b]"
        />
        <div className="aspect-video rounded-2xl border-2 border-dashed border-[#3f3f46] bg-[rgba(24,24,27,.5)] flex flex-col items-center justify-center gap-2.5 cursor-pointer mt-2">
          <div className="w-11 h-11 rounded-[13px] bg-[#27272a] flex items-center justify-center">
            <MaterialIcon name="add_photo_alternate" size={22} color="#71717a" />
          </div>
          <span className="text-[13px] text-[#71717a] font-semibold">Add a photo or video</span>
        </div>
        <div
          onClick={() => navigate("/app/gear/search")}
          className="flex items-center gap-3 mt-4 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
        >
          <MaterialIcon name="inventory_2" size={22} color="#c084fc" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Tag gear from your rig</div>
            <div className="text-[11.5px] text-[#71717a] mt-px">Let others discover what you use</div>
          </div>
          <MaterialIcon name="chevron_right" size={20} color="#3f3f46" />
        </div>
      </div>
      <div className="flex-none flex items-center gap-[22px] px-4 pt-3.5 pb-[22px] border-t border-[#27272a] bg-[#18181b]">
        <MaterialIcon name="image" size={24} color="#a1a1aa" className="cursor-pointer" />
        <MaterialIcon name="photo_camera" size={24} color="#a1a1aa" className="cursor-pointer" />
        <MaterialIcon name="tag" size={24} color="#a1a1aa" className="cursor-pointer" />
        <MaterialIcon name="poll" size={24} color="#a1a1aa" className="cursor-pointer" />
        <span className="ml-auto text-xs text-[#52525b]">{text.length} / 500</span>
      </div>
    </div>
  );
}
