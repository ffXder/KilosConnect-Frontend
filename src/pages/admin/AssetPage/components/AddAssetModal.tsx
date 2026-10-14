import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Package, Plus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (asset: any) => void;
}

const zones = [
  "Mezzanine",
  "Powerlifting Area",
  "Open WOD Area",
  "CrossFit Area",
  "Weightlifting Area",
  "General Storage",
];

// classification/category
const categories = ["Equipment", "Machine", "Tool"];

const conditions = [
  "Working",
  "Needs Repair",
  "Under Repair",
  "Needs Replacement",
  "Hazardous",
  "Decommissioned",
];

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = () => ({
  name: "",
  category: "",
  condition: "",
  area: "",
  srp: "",
  value: "",
  purchaseDate: today(),
});

/* Shared field styles (light + dark) */
const inputClass =
  "w-full px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-gray-400 bg-white border border-[#e2e8f0] rounded-xl transition-colors " +
  "focus:outline-none focus:border-[#0a2e27] focus:ring-2 focus:ring-[#0a2e27]/20 " +
  "dark:text-slate-50 dark:placeholder:text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20";

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
        <span className="text-red-500 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
    <div className="min-w-0">{children}</div>
  </div>
);

const SelectWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative">
    {children}
    <ChevronDown
      size={18}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 pointer-events-none"
    />
  </div>
);

export const AddAssetModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState(emptyForm);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setFormData(emptyForm());
  }, [isOpen]);

  // Escape to close, lock background scroll, focus the name field
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Every field marked * is required
  const isValid =
    formData.name.trim() !== "" &&
    formData.category !== "" &&
    formData.condition !== "" &&
    formData.area !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-asset-title"
        className="w-full max-w-xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:[color-scheme:dark] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#0a2e27] px-6 py-5 sm:px-8 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
              <Package size={20} />
            </div>
            <div className="min-w-0">
              <h2 id="add-asset-title" className="text-lg font-bold leading-tight">
                Add facility asset
              </h2>
              <p className="text-sm text-white/60 mt-0.5">
                Configure tracking settings for new equipment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-5">
            <FormRow id="asset-name" label="Asset name" required>
              <input
                ref={nameRef}
                id="asset-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                className={inputClass}
                placeholder="e.g. Rowing Machine #13"
              />
            </FormRow>

            <FormRow id="asset-category" label="Category" required>
              <SelectWrap>
                <select
                  id="asset-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </SelectWrap>
            </FormRow>

            <FormRow id="asset-condition" label="Condition" required>
              <SelectWrap>
                <select
                  id="asset-condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="" disabled>Select condition</option>
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </SelectWrap>
            </FormRow>

            <FormRow id="asset-area" label="Target area" required>
              <SelectWrap>
                <select
                  id="asset-area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="" disabled>Select area</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </SelectWrap>
            </FormRow>

            <FormRow id="asset-date" label="Acquisition date">
              <input
                id="asset-date"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormRow>

            <FormRow id="asset-srp" label="SRP">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-slate-500 pointer-events-none">
                  â‚±
                </span>
                <input
                  id="asset-srp"
                  name="srp"
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  value={formData.srp}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                  placeholder="15000"
                />
              </div>
            </FormRow>
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
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2e27]/40 dark:focus-visible:ring-emerald-500/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2e27]/40 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-500/50 dark:focus-visible:ring-offset-slate-900 ${
                  isValid
                    ? "bg-[#0a2e27] text-white shadow-sm hover:bg-[#08241f] active:scale-[0.98] dark:bg-emerald-700 dark:hover:bg-emerald-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
                }`}
              >
                <Plus size={18} />
                Register asset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
