import React, { useState } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { Clock, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import ReviewList from "./ReviewList";
import ReviewDetailsModal from "./ReviewDetailsModal";

export default function BuddySystemPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submissions">("pending");
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  const { role } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  const reviews = [
    { id: 1, area: "Powerlifting Area", cust: "Custodian #3", time: "Today, 08:42 AM", progress: "4/4", status: "Ready for Audit" },
    { id: 2, area: "CrossFit Area", cust: "Custodian #5", time: "Today, 09:15 AM", progress: "3/4", status: "In Progress" },
    { id: 3, area: "WOD Area", cust: "Custodian #2", time: "Today, 10:03 AM", progress: "4/4", status: "Ready for Audit" },
    { id: 4, area: "Weightlifting Area", cust: "Custodian #6", time: "Today, 11:20 AM", progress: "4/4", status: "Ready for Audit" },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="bg-amber-50 p-3.5 rounded-xl text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">4</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5 dark:text-slate-300">To Review</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="bg-rose-50 p-3.5 rounded-xl text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                <AlertCircle size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">0</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5 dark:text-slate-300">Disputes Filed</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
              <div className="bg-emerald-50 p-3.5 rounded-xl text-[#0a2e27] dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">2</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5 dark:text-slate-300">My Approved</p>
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
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-[#0a2e27] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Pending Reviews
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                activeTab === 'pending'
                  ? 'bg-amber-400 text-amber-950'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
              }`}>
                4
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'submissions'
                  ? 'bg-[#0a2e27] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              My Submissions
            </button>
          </div>

          {/* Review List View */}
          {activeTab === 'pending' ? (
            <ReviewList 
              reviews={reviews} 
              onViewDetails={(review) => setSelectedReview(review)} 
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center dark:bg-slate-900 dark:border-slate-700">
              <p className="text-gray-500 font-medium dark:text-slate-300">No previous submissions found.</p>
            </div>
          )}
      </main>

      {/* Pop-up Modal */}
      {selectedReview && (
        <ReviewDetailsModal 
          review={selectedReview} 
          onClose={() => setSelectedReview(null)} 
        />
      )}
    </div>
  );
}