import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { NoSearchResults } from "@/components/NoSearchResults";
import { trendingGearData, searchCreatorsData, popularSpacesData } from "./data";

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filteredGear = useMemo(
    () => (q ? trendingGearData.filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)) : trendingGearData),
    [q],
  );
  const filteredCreators = useMemo(
    () => (q ? searchCreatorsData.filter((c) => c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q)) : searchCreatorsData),
    [q],
  );
  const filteredSpaces = useMemo(
    () => (q ? popularSpacesData.filter((sp) => sp.name.toLowerCase().includes(q)) : popularSpacesData),
    [q],
  );
  const hasNoResults = q.length > 0 && filteredGear.length === 0 && filteredCreators.length === 0 && filteredSpaces.length === 0;

  return (
    <div className="gpfade max-w-screen-md mx-auto">
      <div className="sticky top-0 z-[4] p-4 bg-[rgba(24,24,27,.95)] backdrop-blur-md border-b border-[#27272a]">
        <div className="relative">
          <MaterialIcon name="search" size={21} color="#71717a" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands, gear, creators"
            className="w-full h-12 rounded-[11px] bg-[#27272a] border border-[#3f3f46] text-[#fafafa] pl-11 pr-4 text-[15px] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>
      {hasNoResults ? (
        <NoSearchResults query={query.trim()} />
      ) : (
      <div className="px-4 pt-5 pb-6 flex flex-col gap-8">
        {filteredGear.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="trending_up" size={21} color="#3b82f6" />
            <h2 className="text-[19px] font-extrabold">Trending Gear</h2>
          </div>
          <div className="flex flex-col gap-3">
            {filteredGear.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)]"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-[13px] flex items-center justify-center text-2xl border border-[#3f3f46]"
                    style={{ background: "linear-gradient(135deg,#27272a,#18181b)" }}
                  >
                    {g.emoji}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold">{g.name}</div>
                    <div className="text-[13px] text-[#71717a]">{g.category}</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#10b981]">{g.trend}</span>
              </div>
            ))}
          </div>
        </div>
        )}
        {filteredCreators.length > 0 && (
        <div>
          <h2 className="text-[19px] font-extrabold mb-4">Popular Creators</h2>
          <div className="flex flex-col gap-3">
            {filteredCreators.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate("/app/profile")}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="gp-grad w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                    {c.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-[5px]">
                      <span className="text-[15px] font-bold">{c.name}</span>
                      {c.verified && <MaterialIcon name="verified" size={15} color="#3b82f6" filled />}
                    </div>
                    <div className="text-[13px] text-[#71717a]">{c.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{c.followers}</div>
                  <div className="text-[11.5px] text-[#71717a]">followers</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        {filteredSpaces.length > 0 && (
        <div>
          <h2 className="text-[19px] font-extrabold mb-4">Popular Spaces</h2>
          <div className="flex flex-col gap-3">
            {filteredSpaces.map((sp) => (
              <div
                key={sp.id}
                onClick={() => navigate(`/app/spaces/${sp.name.toLowerCase().split(" ")[0]}`)}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#27272a] bg-[rgba(24,24,27,.5)] cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-[13px] flex items-center justify-center text-2xl border border-[#3f3f46]"
                  style={{ background: "linear-gradient(135deg,#27272a,#18181b)" }}
                >
                  {sp.emoji}
                </div>
                <div>
                  <div className="text-[15px] font-bold">{sp.name}</div>
                  <div className="flex items-center gap-1.5 text-[#71717a] mt-0.5">
                    <MaterialIcon name="group" size={14} />
                    <span className="text-[13px]">{sp.members} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        {!q && (
        <div>
          <h2 className="text-[19px] font-extrabold mb-4">New Releases</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-2xl border border-[#27272a] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="aspect-square rounded-2xl border border-[#27272a] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        )}
      </div>
      )}
    </div>
  );
}
