import { useRef } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  fallbackEmoji?: string;
  size?: number;
}

export function AvatarUpload({ avatarUrl, fallbackEmoji = "🎤", size = 96 }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, uploading, error } = useAvatarUpload();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadAvatar(file);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="gp-grad rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: size, height: size, fontSize: size * 0.42 }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            fallbackEmoji
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-[#3f3f46] border-t-[#fafafa] animate-spin" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#27272a] border-2 border-[#09090b] flex items-center justify-center cursor-pointer disabled:opacity-60"
        >
          <MaterialIcon name="photo_camera" size={16} color="#fafafa" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <span
        onClick={() => inputRef.current?.click()}
        className="text-[13.5px] text-[#c084fc] font-semibold mt-3 cursor-pointer"
      >
        {uploading ? "Uploading..." : "Change profile photo"}
      </span>
      {error && <p className="text-[12.5px] text-[#f87171] mt-1.5 text-center max-w-[240px]">{error}</p>}
    </div>
  );
}
