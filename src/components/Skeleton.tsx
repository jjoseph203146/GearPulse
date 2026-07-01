import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[#27272a]", className)} />;
}

export function PostSkeleton() {
  return (
    <div className="border-b border-[#27272a] px-4 pt-4 pb-3">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-full flex-none" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-full mb-2" />
      <Skeleton className="h-3.5 w-4/5 mb-3" />
      <Skeleton className="w-full aspect-video" />
    </div>
  );
}

export function ChatRowSkeleton() {
  return (
    <div className="flex items-start gap-3.5 p-4 border-b border-[#27272a]">
      <Skeleton className="w-[54px] h-[54px] rounded-full flex-none" />
      <div className="flex-1 flex flex-col gap-2 pt-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

export function SpaceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-[22px]">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-[60px] h-[60px] rounded-2xl" />
        <Skeleton className="h-[34px] w-16 rounded-[10px]" />
      </div>
      <Skeleton className="h-5 w-40 mb-2.5" />
      <Skeleton className="h-3.5 w-56 mb-3.5" />
      <Skeleton className="h-3.5 w-24" />
    </div>
  );
}

export function GearCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
      <Skeleton className="w-16 h-16 rounded-xl flex-none" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function RigItemSkeleton() {
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)]">
      <Skeleton className="w-14 h-14 rounded-[13px] flex-none" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
