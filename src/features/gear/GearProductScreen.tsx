import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Users, MessageSquare, Star, Check, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addGearToRig, fetchGearById, fetchGearCreators, fetchReviews, isGearInRig, submitReview } from "@/features/gear/data";
import { fetchPostsByGear, toggleLike, toggleSave } from "@/features/feed/data";
import { PostCard } from "@/features/feed/PostCard";
import { useAuth } from "@/hooks/useAuth";
import type { GearDetail, GearReview, GearSpec, Post, PostAuthor } from "@/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function GearProductScreen() {
  const navigate = useNavigate();
  const { gearId } = useParams<{ gearId: string }>();
  const { user } = useAuth();
  const [gear, setGear] = useState<GearDetail | null | undefined>(undefined);
  const [reviews, setReviews] = useState<GearReview[]>([]);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [creators, setCreators] = useState<PostAuthor[]>([]);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "posts" | "reviews">("details");
  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!gearId) return;
    fetchGearById(gearId).then(setGear);
    fetchReviews(gearId).then(setReviews);
    fetchGearCreators(gearId).then(setCreators);
  }, [gearId]);

  useEffect(() => {
    if (!user || !gearId) return;
    isGearInRig(user.id, gearId).then(setAdded);
  }, [user, gearId]);

  useEffect(() => {
    if (!user || !gearId || activeTab !== "posts" || posts !== null) return;
    fetchPostsByGear(gearId, user.id).then(setPosts);
  }, [user, gearId, activeTab, posts]);

  async function handleToggleLike(post: Post) {
    if (!user) return;
    setPosts((prev) =>
      prev?.map((p) =>
        p.id === post.id ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) } : p,
      ) ?? prev,
    );
    await toggleLike(post.id, user.id, post.liked_by_me);
  }

  async function handleToggleSave(post: Post) {
    if (!user) return;
    setPosts((prev) => prev?.map((p) => (p.id === post.id ? { ...p, saved_by_me: !p.saved_by_me } : p)) ?? prev);
    await toggleSave(post.id, user.id, post.saved_by_me);
  }

  if (gear === undefined) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

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

  async function handleAddToRig() {
    if (!user || !gear) return;
    setAdded(true);
    await addGearToRig(user.id, gear.id);
    setTimeout(() => {
      navigate("/app/profile/my-rig");
    }, 1200);
  }

  async function handleSubmitReview() {
    if (!user || !gearId || myRating === 0 || submittingReview) return;
    setSubmittingReview(true);
    try {
      await submitReview(gearId, user.id, myRating, myText.trim());
      setReviews(await fetchReviews(gearId));
      setGear(await fetchGearById(gearId));
      setMyRating(0);
      setMyText("");
    } finally {
      setSubmittingReview(false);
    }
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
      />
    ));
  }

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
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-white">{gear.ownersCount.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">owners</p>
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex items-center gap-1.5 flex-1">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-white">{gear.postsCount.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">posts</p>
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex gap-0.5">{renderStars(gear.rating)}</div>
              <div>
                <p className="text-sm font-semibold text-white">{gear.rating || "—"}</p>
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
            {gear.specs.length === 0 && <p className="p-4 text-sm text-zinc-600">No specs listed yet.</p>}
            {gear.specs.map((spec: GearSpec, i: number) => (
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
          <div className="mb-4 -mx-4">
            {posts === null && <p className="text-center text-sm text-zinc-600 py-8">Loading posts…</p>}
            {posts?.length === 0 && (
              <p className="text-center text-sm text-zinc-600 py-8">No posts tagged with this gear yet.</p>
            )}
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3 mb-4">
            {/* Rating summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{gear.rating || "—"}</p>
                <div className="flex justify-center gap-0.5 my-1">{renderStars(gear.rating)}</div>
                <p className="text-xs text-zinc-500">{gear.reviewsCount.toLocaleString()} reviews</p>
              </div>
            </div>

            {/* Write a review */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm font-semibold text-white mb-2">Write a review</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    onClick={() => setMyRating(n)}
                    className={`w-6 h-6 cursor-pointer ${n <= myRating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                  />
                ))}
              </div>
              <textarea
                value={myText}
                onChange={(e) => setMyText(e.target.value)}
                placeholder="Share your experience with this gear..."
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={myRating === 0 || submittingReview}
                className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-500"
              >
                {submittingReview ? "Submitting…" : "Submit Review"}
              </Button>
            </div>

            {reviews.length === 0 && (
              <p className="text-center text-sm text-zinc-600 py-4">No reviews yet. Be the first!</p>
            )}
            {reviews.map((review) => (
              <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-lg overflow-hidden">
                    {review.author.avatar_url ? (
                      <img src={review.author.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      review.author.avatar_emoji ?? "🎵"
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{review.author.display_name}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-zinc-500 ml-1">{timeAgo(review.created_at)}</span>
                    </div>
                  </div>
                </div>
                {review.text && <p className="text-sm text-zinc-400 leading-relaxed">{review.text}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Creators using this gear */}
        {creators.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Creators using this gear</h3>
            <div className="space-y-2">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => navigate(`/app/u/${creator.username}`)}
                  className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 flex items-center justify-center text-lg">
                    {creator.avatar_url ? (
                      <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      creator.avatar_emoji ?? "🎵"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{creator.display_name}</p>
                    <p className="text-xs text-zinc-500">@{creator.username}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related gear */}
        {gear.related.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Related gear</h3>
            <div className="space-y-2">
              {gear.related.map((related) => (
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
            disabled={added}
            className={`w-full h-12 text-base font-semibold transition-all ${
              added
                ? "bg-emerald-600 hover:bg-emerald-600 border-emerald-600"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            }`}
          >
            {added ? (
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
