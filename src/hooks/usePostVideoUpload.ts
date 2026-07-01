import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];

export function usePostVideoUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadPostVideo(file: File | Blob, extHint = "webm"): Promise<string | null> {
    if (!user) return null;
    setError(null);

    const type = file instanceof File ? file.type : "video/webm";
    if (type && !ALLOWED_TYPES.includes(type)) {
      setError("Please choose an MP4, MOV, or WEBM video.");
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Video must be smaller than 100MB.");
      return null;
    }

    setUploading(true);
    const ext = file instanceof File ? file.name.split(".").pop() || extHint : extHint;
    const path = `${user.id}/post-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-media")
      .upload(path, file, { upsert: false, cacheControl: "3600", contentType: type || undefined });

    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    return data.publicUrl;
  }

  return { uploadPostVideo, uploading, error };
}
