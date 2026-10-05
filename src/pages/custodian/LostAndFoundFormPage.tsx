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
  "w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-base font-normal bg-white focus:ring-2 focus:ring-[#1e4d46]/10 focus:border-[#1e4d46] outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider";

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-['Poppins']">
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
            <div className="bg-[#1C2D24] rounded-2xl p-5 text-[#FDFFE0]">
              <h1 className="text-xl font-semibold tracking-tight">Add Found Item</h1>
              <p className="text-white/70 text-sm mt-0.5">Record an item found in the facility</p>
            </div>

            {/* Fields */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
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
                  <div className="relative rounded-xl overflow-hidden h-52 bg-gray-900">
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
                    className="w-full border-2 border-dashed border-[#e8e8e8] rounded-[12px] h-40 flex flex-col items-center justify-center bg-[#fcfcfc] active:bg-gray-50 transition-colors"
                  >
                    <ImagePlus size={28} className="text-[#94a3b8] mb-2" />
                    <span className="text-[13px] font-medium text-gray-700">Tap to take or choose a photo</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">Maximum file size: {MAX_MB}MB</span>
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
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl p-3">
                  {error}
                </div>
              )}
            </div>

            {/* Sticky submit bar (always reachable on a phone) */}
            <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[#f8fafc]/95 backdrop-blur border-t border-gray-100 sm:border-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3.5 border border-[#e8e8e8] bg-white rounded-xl text-sm font-medium text-gray-600 active:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`flex-[2] py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    isFormValid && !isSubmitting
                      ? "bg-[#d86125] text-[#FDFFE0] hover:bg-[#ba6300] shadow-md"
                      : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
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