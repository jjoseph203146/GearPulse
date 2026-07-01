import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchGearCategories, submitCustomGear } from "@/features/gear/data";
import { useAuth } from "@/hooks/useAuth";
import type { GearCategory } from "@/types";

type SubmitMode = "profile" | "catalog";

export function CustomGearScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<GearCategory[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitMode, setSubmitMode] = useState<SubmitMode>("profile");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGearCategories().then((cats) => setCategories(cats.filter((c) => c.id !== "all")));
  }, []);

  const isValid = name.trim().length > 0 && brand.trim().length > 0 && category.length > 0;

  async function handleSubmit() {
    if (!isValid || !user || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitCustomGear(user.id, { name: name.trim(), brand: brand.trim(), categoryId: category, mode: submitMode });
      setSubmitted(true);
      setTimeout(() => {
        navigate("/app/profile/my-rig");
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add gear");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 z-40">
        <div className="flex items-center gap-3 p-4 max-w-screen-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white flex-shrink-0">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Add custom gear</h1>
            <p className="text-xs text-zinc-500">Not in the catalog? Add it yourself</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-6 space-y-6">
        {/* Photo upload */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">Photo</label>
          <div className="aspect-video rounded-2xl border-2 border-dashed border-zinc-700 hover:border-blue-600 transition-colors bg-zinc-900/50 flex flex-col items-center justify-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
              <Camera className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-400 font-medium">Tap to add a photo</p>
              <p className="text-xs text-zinc-600 mt-0.5">Show off your gear</p>
            </div>
          </div>
        </div>

        {/* Product name */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
            Product name <span className="text-blue-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Roland FA-08, Custom Pedalboard..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
            Brand <span className="text-blue-400">*</span>
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Roland, DIY, Handmade..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">
            Category <span className="text-blue-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat.id
                    ? "bg-blue-600 text-white border border-blue-500"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
            Description <span className="text-zinc-600">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell the community about this piece of gear..."
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
          <p className="text-xs text-zinc-600 mt-1 text-right">{description.length}/300</p>
        </div>

        {/* Submit mode */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">Visibility</label>
          <div className="space-y-2">
            <button
              onClick={() => setSubmitMode("profile")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                submitMode === "profile" ? "border-blue-600 bg-blue-600/10" : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  submitMode === "profile" ? "border-blue-500 bg-blue-600" : "border-zinc-600"
                }`}
              >
                {submitMode === "profile" && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-sm text-white">Add only to my profile</p>
                <p className="text-xs text-zinc-500 mt-0.5">Visible on your rig — won't appear in the public catalog</p>
              </div>
            </button>

            <button
              onClick={() => setSubmitMode("catalog")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                submitMode === "catalog" ? "border-blue-600 bg-blue-600/10" : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  submitMode === "catalog" ? "border-blue-500 bg-blue-600" : "border-zinc-600"
                }`}
              >
                {submitMode === "catalog" && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-sm text-white">Submit to GearPulse catalog</p>
                <p className="text-xs text-zinc-500 mt-0.5">Help the community — gear will be reviewed and added publicly</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 p-4 pb-6">
        <div className="max-w-screen-md mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitted || submitting}
            className={`w-full h-12 text-base font-semibold transition-all ${
              submitted
                ? "bg-emerald-600 hover:bg-emerald-600"
                : isValid
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {submitted ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to My Rig
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                {submitting ? "Saving…" : submitMode === "catalog" ? "Submit to Catalog" : "Add to My Rig"}
              </>
            )}
          </Button>
          {error && <p className="text-xs text-red-400 text-center mt-2">{error}</p>}
          {!isValid && !error && <p className="text-xs text-zinc-600 text-center mt-2">Name, brand, and category are required</p>}
        </div>
      </div>
    </div>
  );
}
