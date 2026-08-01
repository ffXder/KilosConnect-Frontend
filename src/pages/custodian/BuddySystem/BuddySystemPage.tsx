import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { Clock, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import ReviewList from "./ReviewList";
import ReviewDetailsModal from "./ReviewDetailsModal";

export default function BuddySystemPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submissions">("pending");
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(
    JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
  );

  useEffect(() => {
    const syncSidebar = () => {
      setSidebarExpanded(
        JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
      );
    };

    const interval = setInterval(syncSidebar, 100);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans relative">
      <SidebarNavigationSection userRole={userRole} />

      <div
        className={`transition-all duration-1000 flex-1 flex flex-col ${
          sidebarExpanded ? "md:ml-[15px]" : "md:ml-[10px]"
        }`}
      >
        <main className="pt-20 p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 flex-1">
          
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Buddy System</h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">Decentralised peer-review audit portal</p>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-amber-50 p-3.5 rounded-xl text-amber-600">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5">To Review</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-rose-50 p-3.5 rounded-xl text-rose-600">
                <AlertCircle size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5">Disputes Filed</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-emerald-50 p-3.5 rounded-xl text-[#0a2e27]">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5">My Approved</p>
              </div>
            </div>
          </div>

          {/* Accountability Notice */}
          <div className="bg-white border border-blue-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Accountability Assurance</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed">
                You are reviewing work submitted by fellow custodians. Your accountability ID 
                <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded mx-1">CUST-001</span> 
                is automatically logged on every action — approvals and disputes alike.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-[#0a2e27] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Pending Reviews
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                activeTab === 'pending' ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800'
              }`}>
                4
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'submissions'
                  ? 'bg-[#0a2e27] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-500 font-medium">No previous submissions found.</p>
            </div>
          )}
        </main>
      </div>

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