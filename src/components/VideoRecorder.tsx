import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

const MAX_RECORD_SECONDS = 60;

export interface RecordedVideo {
  blob: Blob;
  url: string;
}

interface VideoRecorderProps {
  video: RecordedVideo | null;
  onChange: (video: RecordedVideo | null) => void;
}

export function VideoRecorder({ video, onChange }: VideoRecorderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true;
        await previewRef.current.play().catch(() => {});
      }

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        onChange({ blob, url: URL.createObjectURL(blob) });
        stopStream();
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_RECORD_SECONDS) {
            recorder.stop();
            setRecording(false);
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("Camera and microphone access is required to record a video.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onChange({ blob: file, url: URL.createObjectURL(file) });
  }

  function remove() {
    if (video) URL.revokeObjectURL(video.url);
    onChange(null);
  }

  if (recording) {
    return (
      <div className="mt-4 rounded-2xl overflow-hidden border border-[#27272a] bg-black relative">
        <video ref={previewRef} className="w-full aspect-video object-cover" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-[12px] text-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </div>
        <button
          onClick={stopRecording}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#ef4444] border-4 border-white/80 cursor-pointer"
        />
      </div>
    );
  }

  if (video) {
    return (
      <div className="mt-4 rounded-2xl overflow-hidden border border-[#27272a] bg-black relative">
        <video src={video.url} controls playsInline className="w-full aspect-video object-cover" />
        <button
          onClick={remove}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center cursor-pointer"
        >
          <MaterialIcon name="close" size={18} color="#fff" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={startRecording}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[14px] border border-[#3f3f46] bg-transparent text-[#fafafa] text-sm font-semibold cursor-pointer"
        >
          <MaterialIcon name="videocam" size={20} color="#60a5fa" />
          Record video
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[14px] border border-[#3f3f46] bg-transparent text-[#fafafa] text-sm font-semibold cursor-pointer"
        >
          <MaterialIcon name="upload_file" size={20} color="#60a5fa" />
          Upload video
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
      {error && <p className="text-[12.5px] text-[#f87171] mt-2">{error}</p>}
    </div>
  );
}
