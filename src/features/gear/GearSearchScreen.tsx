import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { ArrowLeft, Search, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoSearchResults } from "@/components/NoSearchResults";
import { GearCardSkeleton } from "@/components/Skeleton";
import { fetchGearCategories, fetchPopularGear, searchGear } from "@/features/gear/data";
import type { GearCategory, GearListItem } from "@/types";

export function GearSearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<GearCategory[]>([]);
  const [popular, setPopular] = useState<GearListItem[] | null>(null);
  const [results, setResults] = useState<GearListItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGearCategories().then(setCategories);
    fetchPopularGear().then(setPopular);
  }, []);

  const showBrowse = query.length === 0 && activeCategory === "all";

  useEffect(() => {
    if (showBrowse) {
      setResults(null);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      searchGear(query, activeCategory)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(handle);
  }, [query, activeCategory, showBrowse]);

  const browseCategories = categories.filter((c) => c.id !== "all");

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 z-40">
        <div className="flex items-center gap-3 p-4 max-w-screen-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white flex-shrink-0">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Add gear to your rig</h1>
            <p className="text-xs text-zinc-500">Search the GearPulse catalog</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 max-w-screen-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keyboards, guitars, microphones, interfaces..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="pb-3 max-w-screen-md mx-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-2 px-4" style={{ width: "max-content" }}>
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
              }`}
            >
              All
            </button>
            {browseCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-screen-md mx-auto w-full px-4 py-4">
        {showBrowse ? (
          <>
            {/* Browse by category grid */}
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Browse by category</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {browseCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs text-zinc-400 font-medium text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Featured / trending gear */}
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Popular on GearPulse</p>
            <div className="space-y-2">
              {popular === null
                ? Array.from({ length: 3 }).map((_, i) => <GearCardSkeleton key={i} />)
                : popular.map((item) => <GearResultCard key={item.id} item={item} navigate={navigate} />)}
            </div>
          </>
        ) : (
          <>
            {loading || results === null ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <GearCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-2">
                  {results.map((item) => (
                    <GearResultCard key={item.id} item={item} navigate={navigate} />
                  ))}
                </div>
              </>
            ) : (
              <NoSearchResults query={query.trim()} />
            )}
          </>
        )}

        {/* Can't find your gear */}
        <div className="mt-8 mb-4">
          <div
            onClick={() => navigate("/app/gear/custom")}
            className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-zinc-700 hover:border-blue-600 hover:bg-blue-600/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-zinc-400 group-hover:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-zinc-200">Can't find your gear?</p>
                <p className="text-xs text-zinc-500">Add custom equipment to your rig</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GearResultCard({ item, navigate }: { item: GearListItem; navigate: NavigateFunction }) {
  return (
    <div
      onClick={() => navigate(`/app/gear/${item.id}`)}
      className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all cursor-pointer"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 mb-0.5">
          {item.categoryEmoji} {item.category}
        </p>
        <h3 className="font-semibold text-sm text-white truncate">{item.name}</h3>
        <p className="text-xs text-zinc-400">{item.brand}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{item.ownersCount.toLocaleString()} owners</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center">
          <Plus className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </div>
  );
}
