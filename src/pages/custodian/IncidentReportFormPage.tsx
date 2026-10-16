import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import SuccessScreen from "../../components/SuccessScreen";
import { useAuth } from "../../hooks/useAuth";
import { useAssets } from "../../hooks/useAssets";
import type { NewIncidentReport } from "../../types/incident";
import { createReport } from "../../services/incidentService";

const locations = [
  "Mezzanine", "Powerlifting Area", "Open WOD Area",
  "CrossFit Area", "Café", "General Storage", "Maintenance Storage",
];

const severities: NewIncidentReport["severity"][] = ["Low", "Medium", "High", "Urgent", "Critical"];

const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#11382C] focus:ring-2 focus:ring-[#11382C]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";
const labelCls = "mb-2 block text-sm font-bold text-gray-700 dark:text-slate-200";

export default function IncidentReportFormPage() {
  const navigate = useNavigate();
  const { assets, loading: assetsLoading } = useAssets();

  const { role } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<NewIncidentReport["severity"]>("Low");
  const [area, setArea] = useState("");
  const [dateAndTime, setDateAndTime] = useState(nowLocal());
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [affectedAssets, setAffectedAssets] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = title.trim() !== "" && area !== "" && dateAndTime !== "";
  const availableAssets = assets.filter((item) => !affectedAssets.includes(item._id));

  const handleAddAsset = () => {
    if (!selectedAssetId || affectedAssets.includes(selectedAssetId)) return;
    setAffectedAssets((current) => [...current, selectedAssetId]);
    setSelectedAssetId("");
  };

  const handleRemoveAsset = (id: string) => {
    setAffectedAssets((current) => current.filter((item) => item !== id));
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setSeverity("Low");
    setArea("");
    setDateAndTime(nowLocal());
    setSelectedAssetId("");
    setAffectedAssets([]);
    setError(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createReport({ title, description, severity, area, dateAndTime, affectedAssets });
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
            title="Incident Reported!"
            message="Your report was logged and the admin has been notified."
            primaryLabel="Report another incident"
            onPrimary={reset}
            secondaryLabel="Back to dashboard"
            onSecondary={() => navigate("/custodian/dashboard")}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="bg-[#11382C] rounded-2xl p-5 text-white">
              <h1 className="text-xl font-bold">Report New Incident</h1>
              <p className="mt-0.5 text-sm text-emerald-100/80">
                Fill in the details and link any affected equipment
              </p>
            </div>

            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              {/* Title */}
              <div>
                <label className={labelCls}>Incident Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                  placeholder="Enter incident title"
                />
              </div>

              {/* Location + Severity */}
              <div>
                <label className={labelCls}>Area *</label>
                <div className="relative">
                  <select
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="" disabled>Select zone</option>
                    {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Severity *</label>
                <div className="relative">
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as NewIncidentReport["severity"])}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    {severities.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                </div>
              </div>

              {/* Date and time */}
              <div>
                <label className={labelCls}>Date and Time Occurred *</label>
                <input
                  required
                  type="datetime-local"
                  value={dateAndTime}
                  onChange={(e) => setDateAndTime(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Affected assets */}
              <div>
                <label className={labelCls}>
                  Affected Assets <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <div className="mb-3 flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <select
                      value={selectedAssetId}
                      onChange={(event) => setSelectedAssetId(event.target.value)}
                      disabled={assetsLoading}
                      className={`${inputCls} appearance-none pr-10`}
                    >
                      <option value="">{assetsLoading ? "Loading assets..." : "Select an asset"}</option>
                      {availableAssets.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} ({item.assetId})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAsset}
                    disabled={!selectedAssetId}
                    className="rounded-xl bg-emerald-50 px-5 font-bold text-[#11382C] transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                  >
                    Add
                  </button>
                </div>
                {affectedAssets.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {affectedAssets.map((id) => {
                      const item = assets.find((candidate) => candidate._id === id);
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 py-1.5 pl-3 pr-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {item?.name ?? "Asset"}
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset(id)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                            aria-label={`Remove ${item?.name ?? "asset"}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputCls} resize-none`}
                  placeholder="Describe the issue..."
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                  {error}
                </div>
              )}
            </div>

            {/* Sticky submit bar */}
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
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}