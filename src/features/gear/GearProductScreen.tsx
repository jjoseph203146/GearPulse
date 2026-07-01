import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Users, MessageSquare, Star, Check, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gearCatalog, communityPostImages } from "@/features/gear/data";
import { useAppState } from "@/hooks/useAppState";

const mockReviews = [
  {
    id: 1,
    user: "Mark P.",
    avatar: "🎹",
    rating: 5,
    text: "Best keyboard I've ever played. The action is incredible and the sounds are studio quality — worth every penny.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    user: "Sarah K.",
    avatar: "🎸",
    rating: 5,
    text: "Been using this live for 6 months and it never lets me down. The build quality is exceptional.",
    date: "1 month ago",
  },
  {
    id: 3,
    user: "DJ Mike",
    avatar: "🎧",
    rating: 4,
    text: "Amazing quality overall. My only complaint is the weight, but that's expected at this level.",
    date: "3 months ago",
  },
];

export function GearProductScreen() {
  const navigate = useNavigate();
  const { gearId } = useParams<{ gearId: string }>();
  const { addToRig, gearAdded } = useAppState();
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "posts" | "reviews">("details");

  const gear = gearCatalog.find((g) => g.id === gearId);

  if (!gear) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-zinc-300 font-semibold">Gear not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4" variant="outline">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  const relatedGear = gearCatalog.filter((g) => gear.relatedIds.includes(g.id)).slice(0, 3);

  function handleAddToRig() {
    setAdded(true);
    addToRig(gear!.id);
    setTimeout(() => {
      navigate("/app/profile/my-rig");
    }, 1200);
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
      />
    ));
  }

  const isAdded = added || gearAdded;

  return (
    <div className="min-h-screen bg-zinc-950 pb-28">
      {/* Hero Image */}
      <div className="relative h-72 overflow-hidden">
        <img src={gear.image} alt={gear.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Floating nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Product info card */}
      <div className="max-w-screen-md mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full mb-2">
                {gear.categoryEmoji} {gear.category}
              </span>
              <h1 className="text-2xl font-bold text-white leading-tight">{gear.name}</h1>
              <p className="text-zinc-400 mt-0.5">{gear.brand}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 py-3 border-t border-b border-zinc-800 my-3">
            <div className="flex items-center gap-1.5 flex-1">
              <Users className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-white">{gear.ownersCount.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">owners</p>
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex items-center gap-1.5 flex-1">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-white">{gear.postsCount.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">posts</p>
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex gap-0.5">{renderStars(gear.rating)}</div>
              <div>
                <p className="text-sm font-semibold text-white">{gear.rating}</p>
                <p className="text-xs text-zinc-500">{gear.reviewsCount.toLocaleString()} reviews</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">{gear.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-4">
          {(["details", "posts", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "details" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-4">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="font-semibold text-sm text-zinc-300">Specifications</h3>
            </div>
            {gear.specs.map((spec, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < gear.specs.length - 1 ? "border-b border-zinc-800/60" : ""
                }`}
              >
                <span className="text-sm text-zinc-500">{spec.label}</span>
                <span className="text-sm text-zinc-200 font-medium text-right max-w-[55%]">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2">
              {communityPostImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-zinc-900">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-zinc-600 mt-3">
              {gear.postsCount.toLocaleString()} community posts featuring this gear
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3 mb-4">
            {/* Rating summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{gear.rating}</p>
                <div className="flex justify-center gap-0.5 my-1">{renderStars(gear.rating)}</div>
                <p className="text-xs text-zinc-500">{gear.reviewsCount.toLocaleString()} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 2 : 2;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-3">{star}</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {mockReviews.map((review) => (
              <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{review.user}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-zinc-500 ml-1">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Related gear */}
        {relatedGear.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Related gear</h3>
            <div className="space-y-2">
              {relatedGear.map((related) => (
                <div
                  key={related.id}
                  onClick={() => navigate(`/app/gear/${related.id}`)}
                  className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img src={related.image} alt={related.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{related.name}</p>
                    <p className="text-xs text-zinc-500">
                      {related.brand} · {related.category}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 p-4 pb-6">
        <div className="max-w-screen-md mx-auto">
          <Button
            onClick={handleAddToRig}
            disabled={isAdded}
            className={`w-full h-12 text-base font-semibold transition-all ${
              isAdded
                ? "bg-emerald-600 hover:bg-emerald-600 border-emerald-600"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to My Rig
              </>
            ) : (
              <>
                <Package className="w-5 h-5 mr-2" />
                Add to My Rig
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
