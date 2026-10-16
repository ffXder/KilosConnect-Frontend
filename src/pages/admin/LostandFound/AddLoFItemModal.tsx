import React, { useState, useRef, useEffect } from 'react';
import { X, ImagePlus, PackagePlus, ChevronDown, Loader2, AlertCircle } from 'lucide-react';


interface ModalProps {
  onClose: () => void;
  onSubmit: (data: any, imageFile: File) => void | Promise<void>;
}

const Areas = [
  "Mezzanine",
  "Powerlifting Area",
  "Open WOD Area",
  "CrossFit Area",
  "Weightlifting Area",
  "General Storage",
  "Mezzanine",
  "Powerlifting Area",
  "Open WOD Area",
  "CrossFit Area",
  "Weightlifting Area",
  "General Storage",
  "Maintenance Storage"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const today = () => new Date().toISOString().split('T')[0];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* Shared field styles (light + dark) */
const inputClass =
  'w-full px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl transition-colors ' +
  'focus:outline-none focus:border-[#116D8C] focus:ring-2 focus:ring-[#116D8C]/20 ' +
  'dark:text-slate-50 dark:placeholder:text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:focus:border-[#116D8C]';

/** Horizontal row: label on the left, control on the right (stacks on mobile). */
const FormRow: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ id, label, required, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-start gap-x-4 gap-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-slate-200 sm:pt-2.5"
    >
      {label}
      {required && (
        <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
      )}
    </label>
    <div className="min-w-0">{children}</div>
  </div>
);

export const AddLoFItemModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    item: "",
    description: "",
    areaFound: Areas[0],
    date: today(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);         // actual File
  const [imagePreview, setImagePreview] = useState<string | null>(null); // just for preview
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Photo is required, so it counts toward validity
  const isFormValid =
    formData.item.trim() !== "" &&
    formData.date !== "" &&
    imageFile !== null;

  // Free the preview URL when it changes or the modal unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Escape to close (not mid-submit), lock background scroll, focus first field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    itemRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isSubmitting, onClose]);

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('That image is larger than 5MB. Please choose a smaller one.');
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
    e.target.value = ''; // allow re-selecting the same file
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !imageFile || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData, imageFile);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lof-add-title"
        className="w-full max-w-xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:[color-scheme:dark] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#002B38] px-6 py-5 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[#FDFFE0]">
              <PackagePlus size={20} />
            </div>
            <div className="min-w-0">
              <h2 id="lof-add-title" className="text-[#FDFFE0] text-lg font-bold leading-tight">
                Add new inventory item
              </h2>
              <p className="text-[#FDFFE0]/60 text-sm mt-0.5">
                Fill in the details to record a found item
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="shrink-0 -mr-2 p-2 rounded-lg text-[#FDFFE0]/70 hover:text-[#FDFFE0] hover:bg-white/10 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFFE0]/60"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-5">
            <FormRow id="lof-item" label="Item name" required>
              <input
                ref={itemRef}
                id="lof-item"
                required
                autoComplete="off"
                className={inputClass}
                placeholder="e.g. Black Water Bottle"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              />
            </FormRow>

            <FormRow id="lof-area" label="Found in" required>
              <div className="relative">
                <select
                  id="lof-area"
                  required
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                  value={formData.areaFound}
                  onChange={(e) => setFormData({ ...formData, areaFound: e.target.value })}
                >
                  {Areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 pointer-events-none"
                />
              </div>
            </FormRow>

            <FormRow id="lof-date" label="Date found" required>
              <input
                id="lof-date"
                required
                type="date"
                max={today()}
                value={formData.date}
                className={inputClass}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </FormRow>

            <FormRow id="lof-description" label="Description">
              <textarea
                id="lof-description"
                rows={3}
                className={`${inputClass} resize-none leading-relaxed`}
                placeholder="Include details like brand, color, or markings..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormRow>

            <FormRow id="lof-photo" label="Item photo" required>
              <input
                id="lof-photo"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full rounded-xl border-2 border-dashed p-4 transition-colors ${
                  isDragging
                    ? 'border-[#116D8C] bg-[#116D8C]/5'
                    : 'border-gray-200 bg-gray-50/60 dark:border-slate-600 dark:bg-slate-800/50'
                }`}
              >
                {imagePreview && imageFile ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview of the found item"
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-100">
                        {imageFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {formatSize(imageFile.size)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116D8C]/40"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove photo"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116D8C]/40"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center rounded-lg py-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116D8C]/40"
                  >
                    <ImagePlus size={24} className="mb-2 text-gray-400 dark:text-slate-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      Drag and drop or click to upload
                    </span>
                    <span className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                      Image files up to 5MB
                    </span>
                  </button>
                )}
              </div>
            </FormRow>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116D8C]/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116D8C]/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                  isFormValid && !isSubmitting
                    ? 'bg-[#116D8C] text-[#FDFFE0] shadow-sm hover:bg-[#0D5873] active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <PackagePlus size={18} />}
                {isSubmitting ? 'Adding...' : 'Add to inventory'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
