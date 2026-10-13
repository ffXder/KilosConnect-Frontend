import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import SuccessScreen from "../../components/SuccessScreen";
import { useAuth } from "../../hooks/useAuth";
import { createLostAndFound } from "../../services/lostAndFoundService";

const Areas = [
  "Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area",
  "Weightlifting Area", "General Storage", "Maintenance Storage",
];

const today = () => new Date().toISOString().split("T")[0];
const MAX_MB = 5;

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#11382C] focus:ring-2 focus:ring-[#11382C]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";
const labelCls = "mb-2 block text-sm font-bold text-gray-700 dark:text-slate-200";

export default function LostAndFoundFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { role } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  const [formData, setFormData] = useState({
    item: "", description: "", areaFound: Areas[0], date: today(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // free the preview URL when it changes or the page closes
  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  const isFormValid = formData.item.trim() !== "" && formData.date !== "" && !!imageFile;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Photo is too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reset = () => {
    setFormData({ item: "", description: "", areaFound: Areas[0], date: today() });
    clearImage();
    setError(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting || !imageFile) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createLostAndFound(formData, imageFile);
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-['Poppins'] transition-colors dark:bg-slate-950 md:flex-row">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 min-w-0 w-full max-w-xl mx-auto px-4 pt-20 pb-4 sm:px-6 sm:pt-24">
        {submitted ? (
          <SuccessScreen
            title="Item Recorded!"
            message="The found item was added to the Lost & Found."
            primaryLabel="Add another item"
            onPrimary={reset}
            secondaryLabel="Back to dashboard"
            onSecondary={() => navigate("/custodian/dashboard")}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="rounded-2xl bg-[#11382C] p-5 text-white">
              <h1 className="text-xl font-semibold tracking-tight">Add Found Item</h1>
              <p className="mt-0.5 text-sm text-emerald-100/80">Record an item found in the facility</p>
            </div>

            {/* Fields */}
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div>
                <label className={labelCls}>Item Name <span className="text-red-500">*</span></label>
                <input
                  required
                  className={inputCls}
                  placeholder="e.g. Black Water Bottle"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  className={`${inputCls} h-24 resize-none`}
                  placeholder="Brand, color, or markings..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className={labelCls}>Found In <span className="text-red-500">*</span></label>
                <select
                  required
                  className={inputCls}
                  value={formData.areaFound}
                  onChange={(e) => setFormData({ ...formData, areaFound: e.target.value })}
                >
                  {Areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              
              <div>
                <label className={labelCls}>Found Item Photo <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative h-52 overflow-hidden rounded-xl bg-gray-900">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full"
                      aria-label="Remove photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-40 w-full flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-[#124d45]/50 hover:bg-emerald-50 active:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:active:bg-emerald-950/40"
                  >
                  <ImagePlus size={28} className="mb-2 text-[#124d45] dark:text-emerald-400" />
                  <span className="text-[13px] font-medium text-gray-700 dark:text-slate-200">Tap to take or choose a photo</span>
                  <span className="mt-0.5 text-[11px] text-gray-400 dark:text-slate-500">Maximum file size: {MAX_MB}MB</span>
                  </button>
                )}
              </div>

              <div>
                <label className={labelCls}>Date Found <span className="text-red-500">*</span></label>
                <input
                  required
                  type="date"
                  className={inputCls}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                  {error}
                </div>
              )}
            </div>

            {/* Sticky submit bar (always reachable on a phone) */}
            <div className="sticky bottom-0 -mx-4 border-t border-gray-100 bg-[#f8fafc]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:mx-0 sm:border-0 sm:px-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`flex-[2] py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isFormValid && !isSubmitting
                      ? "bg-[#124d45] text-emerald-50 shadow-lg hover:bg-[#165c53] dark:bg-emerald-700 dark:hover:bg-emerald-600"
                      : "cursor-not-allowed bg-emerald-50 text-emerald-800/50 dark:bg-emerald-950/60 dark:text-emerald-300/50"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}