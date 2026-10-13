import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
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
  "w-full px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-[#11382C] outline-none";
const labelCls = "block text-sm font-bold text-gray-700 mb-2";

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
  const [asset, setAsset] = useState(""); // single asset _id

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid =
    title.trim() !== "" && area !== "" && dateAndTime !== "" && asset !== "";

  const reset = () => {
    setTitle("");
    setDescription("");
    setSeverity("Low");
    setArea("");
    setDateAndTime(nowLocal());
    setAsset("");
    setError(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createReport({
        title, description, severity, area, dateAndTime, asset,
      });
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
              <p className="text-gray-300 text-sm mt-0.5">
                Fill in the details and select the affected equipment
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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

              {/* Affected asset */}
              <div>
                <label className={labelCls}>Affected Asset *</label>
                <div className="relative">
                  <select
                    required
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    disabled={assetsLoading}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="">{assetsLoading ? "Loading assets..." : "Select an asset"}</option>
                    {assets.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({a.assetId})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
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
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl p-3">
                  {error}
                </div>
              )}
            </div>

            {/* Sticky submit bar */}
            <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[#f8fafc]/95 backdrop-blur border-t border-gray-100 sm:border-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 active:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`flex-[2] py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isFormValid && !isSubmitting
                      ? "bg-[#11382C] text-white hover:bg-[#0a2a21] shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
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