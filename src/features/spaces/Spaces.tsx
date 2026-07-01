import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { SpaceCardSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { createSpace, fetchSpaces, joinSpace, leaveSpace } from "./data";
import type { SpaceListItem } from "@/types";

export function Spaces() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<SpaceListItem[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPublic, setNewPublic] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setSpaces(await fetchSpaces(user.id));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleJoin(space: SpaceListItem) {
    if (!user) return;
    setSpaces((prev) => prev?.map((s) => (s.id === space.id ? { ...s, joined: !s.joined, memberCount: s.memberCount + (s.joined ? -1 : 1) } : s)) ?? prev);
    if (space.joined) await leaveSpace(space.id, user.id);
    else await joinSpace(space.id, user.id);
  }

  async function handleCreate() {
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      await createSpace(newName.trim(), newPublic);
      setNewName("");
      setShowCreate(false);
      await load();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] px-4 py-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-.02em]">Spaces</h1>
            <p className="text-sm text-[#a1a1aa] mt-1">Join communities and discover new gear</p>
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="gp-grad w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer flex-none"
          >
            <MaterialIcon name="add" size={22} color="#fff" />
          </button>
        </div>
        {showCreate && (
          <div className="mt-4 p-4 rounded-2xl border border-[#27272a] bg-[#18181b]">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Space name"
              className="w-full h-11 rounded-[10px] bg-[#27272a] border border-[#3f3f46] px-3.5 text-sm text-[#fafafa] outline-none placeholder:text-[#71717a] mb-3"
            />
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setNewPublic(true)}
                className={`flex-1 h-9 rounded-[9px] text-[13px] font-semibold border ${newPublic ? "border-[#a855f7] bg-[rgba(168,85,247,.1)] text-[#fafafa]" : "border-[#3f3f46] text-[#a1a1aa]"}`}
              >
                Public
              </button>
              <button
                onClick={() => setNewPublic(false)}
                className={`flex-1 h-9 rounded-[9px] text-[13px] font-semibold border ${!newPublic ? "border-[#a855f7] bg-[rgba(168,85,247,.1)] text-[#fafafa]" : "border-[#3f3f46] text-[#a1a1aa]"}`}
              >
                Private
              </button>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
              className="gp-grad w-full h-10 rounded-[10px] border-none text-white text-[13.5px] font-bold cursor-pointer font-sans disabled:opacity-40"
            >
              {creating ? "Creating…" : "Create Space"}
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        {spaces === null
          ? Array.from({ length: 3 }).map((_, i) => <SpaceCardSkeleton key={i} />)
          : spaces.map((sp) => (
              <div
                key={sp.id}
                onClick={() => navigate(`/app/spaces/${sp.id}`)}
                className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-[#18181b] cursor-pointer"
              >
                {sp.image && (
                  <div className="absolute inset-0 opacity-20">
                    <img src={sp.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(0deg,#18181b 10%,rgba(24,24,27,.5),transparent)" }}
                />
                <div className="relative p-[22px]">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: sp.gradient ?? "linear-gradient(135deg,#7c3aed,#9333ea)" }}
                    >
                      {sp.emoji}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleJoin(sp);
                      }}
                      className="h-[34px] px-4 rounded-[10px] border text-[13px] font-semibold cursor-pointer font-sans"
                      style={{
                        borderColor: sp.joined ? "#3f3f46" : "#9333ea",
                        background: sp.joined ? "rgba(39,39,42,.8)" : "#9333ea",
                        color: "#fafafa",
                      }}
                    >
                      {sp.joined ? "Joined" : "Join"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold tracking-[-.01em]">{sp.name}</h3>
                    {!sp.isPublic && <MaterialIcon name="lock" size={16} color="#71717a" />}
                  </div>
                  <p className="text-sm text-[#a1a1aa] mt-1.5 mb-3.5">{sp.description}</p>
                  <div className="flex items-center gap-[7px] text-[#71717a]">
                    <MaterialIcon name="group" size={18} />
                    <span className="text-[13.5px] whitespace-nowrap">{sp.memberCount.toLocaleString()} members</span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
