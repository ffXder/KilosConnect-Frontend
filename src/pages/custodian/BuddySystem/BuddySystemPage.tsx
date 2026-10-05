import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { useTaskReviews } from "../../../hooks/useTaskReview";
import { Clock, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import ReviewList from "./components/ReviewList";
import ReviewDetailView from "./components/ReviewDetailsModal";
import MySubmissions from "./components/MySubmissions";

export default function BuddySystemPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submissions">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { pendingQueue, loading, submittingId, error, approve, dispute } = useTaskReviews();
  const selectedReview = pendingQueue.find(r => r._id === selectedId) ?? null;

  const [sidebarExpanded, setSidebarExpanded] = useState(
    JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
  );

  useEffect(() => {
    const syncSidebar = () => {
      setSidebarExpanded(
        JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
      );
    };
    const interval = setInterval(syncSidebar, 500);
    return () => clearInterval(interval);
  }, []);

  const { role, user } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  const statCard =
    "bg-white rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:gap-5 gap-1.5 text-center sm:text-left dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border-slate-700";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row relative dark:bg-slate-950 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <div
        className={`transition-[margin] duration-300 flex-1 min-w-0 flex flex-col ${
          sidebarExpanded ? "md:ml-[15px]" : "md:ml-[10px]"
        }`}
      >
        <main className="pt-20 p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full space-y-4 sm:space-y-8 flex-1">

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight dark:text-slate-50">
              Buddy System
            </h1>
            <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium dark:text-slate-300">
              Decentralised peer-review audit portal
            </p>
          </div>

          {/* Stats (3 compact columns on mobile) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            <div className={statCard}>
              <div className="bg-amber-50 p-2 sm:p-3.5 rounded-xl text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
                <Clock className="w-[18px] h-[18px] sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-bold leading-none text-gray-900 dark:text-slate-50">
                  {pendingQueue.length}
                </p>
                <p className="text-[11px] sm:text-sm font-semibold text-gray-500 mt-1 sm:mt-0.5 dark:text-slate-300">
                  To Review
                </p>
              </div>
            </div>

            <div className={statCard}>
              <div className="bg-rose-50 p-2 sm:p-3.5 rounded-xl text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                <AlertCircle className="w-[18px] h-[18px] sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-bold leading-none text-gray-900 dark:text-slate-50">—</p>
                <p className="text-[11px] sm:text-sm font-semibold text-gray-500 mt-1 sm:mt-0.5 dark:text-slate-300">
                  Disputes<span className="hidden sm:inline"> Filed</span>
                </p>
              </div>
            </div>

            <div className={statCard}>
              <div className="bg-emerald-50 p-2 sm:p-3.5 rounded-xl text-[#0a2e27] dark:bg-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-[18px] h-[18px] sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-bold leading-none text-gray-900 dark:text-slate-50">—</p>
                <p className="text-[11px] sm:text-sm font-semibold text-gray-500 mt-1 sm:mt-0.5 dark:text-slate-300">
                  <span className="hidden sm:inline">My </span>Approved
                </p>
              </div>
            </div>
          </div>

          {/* Accountability Notice */}
          <div className="bg-white border border-blue-200 rounded-2xl p-3.5 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-slate-700">
            <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-blue-500"></div>
            <div className="bg-blue-50 p-2 sm:p-3 rounded-full text-blue-600 shrink-0 dark:bg-blue-900/40 dark:text-blue-300">
              <ShieldAlert className="w-[18px] h-[18px] sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm sm:text-lg dark:text-slate-50">
                Accountability Assurance
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 font-medium leading-relaxed dark:text-slate-300">
                You are reviewing work submitted by fellow custodians. Your User ID
                <span className="font-bold text-gray-800 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded mx-1 dark:bg-slate-700 dark:text-slate-300">
                  {user?.userId ?? "—"}
                </span>
                is automatically logged on every action.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-100 shadow-sm flex gap-1.5 sm:gap-2 dark:bg-slate-900 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'pending'
                  ? 'bg-[#0a2e27] text-white shadow-sm dark:bg-emerald-600 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-slate-300'
              }`}
            >
              Pending<span className="hidden sm:inline">&nbsp;Reviews</span>
              <span className={`text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md font-bold ${
                activeTab === 'pending' ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingQueue.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'submissions'
                  ? 'bg-[#0a2e27] text-white shadow-sm dark:bg-emerald-600 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-slate-300'
              }`}
            >
              My Submissions
            </button>
          </div>

          {/* List */}
          {activeTab === 'pending' ? (
            <>
              {loading && <p className="text-sm text-gray-500 font-medium dark:text-slate-400">Loading reviews...</p>}
              {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}
              {!loading && !error && (
                <ReviewList
                  reviews={pendingQueue}
                  onViewDetails={(review) => setSelectedId(review._id)}
                />
              )}
            </>
          ) : (
            <MySubmissions />
          )}
        </main>
      </div>

      {selectedReview && (
        <ReviewDetailView
          review={selectedReview}
          submitting={submittingId === selectedReview._id}
          onApprove={approve}
          onDispute={dispute}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}