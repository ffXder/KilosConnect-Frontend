import React, { useState } from "react";
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

  const { role } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans relative dark:bg-slate-950 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 w-full min-w-0 p-4 pt-20 md:p-8 md:pt-8 space-y-6 overflow-x-hidden dark:bg-slate-950 transition-colors duration-300">
          
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-slate-50">Buddy System</h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-medium dark:text-slate-300">Decentralised peer-review audit portal</p>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            <div className="min-w-0 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-5 text-center sm:text-left dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="bg-amber-50 p-2 sm:p-3.5 rounded-lg sm:rounded-xl text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                <Clock size={18} className="sm:hidden" />
                <Clock size={28} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-3xl font-bold leading-tight text-gray-900 dark:text-slate-50">{pendingQueue.length}</p>
                <p className="text-[10px] sm:text-sm font-semibold leading-tight text-gray-500 mt-0.5 dark:text-slate-300">To Review</p>
              </div>
            </div>

            <div className="min-w-0 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-5 text-center sm:text-left dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="bg-rose-50 p-2 sm:p-3.5 rounded-lg sm:rounded-xl text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                <AlertCircle size={18} className="sm:hidden" />
                <AlertCircle size={28} className="hidden sm:block" />
              </div>
              <div>
                <p className="text-lg sm:text-3xl font-bold leading-tight text-gray-900 dark:text-slate-50">0</p>
                <p className="text-[10px] sm:text-sm font-semibold leading-tight text-gray-500 mt-0.5 dark:text-slate-300">Disputes</p>
              </div>
            </div>

            <div className="min-w-0 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-5 text-center sm:text-left dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="bg-sky-50 p-2 sm:p-3.5 rounded-lg sm:rounded-xl text-[#0B3F57] dark:bg-sky-950 dark:text-sky-300">
                <CheckCircle2 size={18} className="sm:hidden" />
                <CheckCircle2 size={28} className="hidden sm:block" />
              </div>
              <div>
                <p className="text-lg sm:text-3xl font-bold leading-tight text-gray-900 dark:text-slate-50">2</p>
                <p className="text-[10px] sm:text-sm font-semibold leading-tight text-gray-500 mt-0.5 dark:text-slate-300">Approved</p>
              </div>
            </div>
          </div>

          {/* Accountability Notice */}
          <div className="bg-white border border-blue-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0 dark:bg-blue-950 dark:text-blue-300">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg dark:text-slate-50">Accountability Assurance</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed dark:text-slate-300">
                You are reviewing work submitted by fellow custodians. Your accountability ID 
                <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded mx-1 dark:bg-slate-800 dark:text-slate-100">CUST-001</span>
                is automatically logged on every action — approvals and disputes alike.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex gap-2 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'pending'
                  ? 'bg-[#0B3F57] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="hidden sm:inline">Pending Reviews</span>
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
                  ? 'bg-[#0B3F57] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800'
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
