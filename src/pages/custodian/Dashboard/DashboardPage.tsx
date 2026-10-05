import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { StatsOverview } from "./components/StatsOverview";
import { BuddyBanner } from "./components/BuddyBanner";
import { QuickActions } from "./components/QuickActions";
import { TasksSection } from "./components/TasksSection";
import { CheckCircle, Search } from "lucide-react";
import { useTodayTasks } from "../../../hooks/useTodayTask";
import { useTaskReviews } from "../../../hooks/useTaskReview"
import TaskDetailsModal from "../TaskOperation/TaskDetailsModal";

export default function CustodianDashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { tasks, summary, loading, error, start, toggle, complete } = useTodayTasks();
  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null;

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { role, user } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  // auto-hide the toast (and clean up the timer if the page closes first)
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleStart = async (id: string) => {
    await start(id);
    setToastMessage("Task started");
  };

  const handleComplete = async (id: string, photo?: Blob) => {
    await complete(id, photo);
    setToastMessage("Task completed");
  };

  const { pendingQueue } = useTaskReviews();
  const reviewCount = pendingQueue.length;
  const pendingCount = summary.activePending;
  const completedCount = summary.completed;

  const filteredTasks = tasks
    .filter((task) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(q) || task.zone.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (activeTab === "pending") return task.status === "Pending" || task.status === "In Progress";
      if (activeTab === "completed") return task.status === "Completed";
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const tabBase =
    "flex-1 sm:flex-none whitespace-nowrap py-2.5 px-2 sm:px-4 rounded-xl text-xs font-bold transition-colors";
  const tabOn = "bg-[#0a2e27] text-white dark:bg-[#207D55]";
  const tabOff =
    "text-gray-500 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] flex-col md:flex-row font-['Poppins'] dark:bg-slate-950">
      <SidebarNavigationSection userRole={userRole} />

      {/* Toast: full width at the bottom on phones, corner card on larger screens */}
      {toastMessage && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-[#0a2e27] text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-xl border border-emerald-700/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle size={20} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="p-4 pt-20 sm:p-6 sm:pt-24 md:p-8 md:ml-[15px] flex-1 min-w-0">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight dark:text-slate-50">
              Welcome Back, {user?.firstName ?? ""}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 dark:text-slate-300">
              Ready to keep Kilos PH in top shape?
            </p>
          </div>

          <StatsOverview
            pendingCount={pendingCount}
            completedCount={completedCount}
            reviewCount={reviewCount}
            onTabChange={(tab) => setActiveTab(tab)}
            tasks={tasks}
            onViewDetails={(task) => setSelectedId(task.id)}
          />

          <BuddyBanner count={reviewCount} />

          <QuickActions reviewCount={reviewCount} />

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              {/* Tabs: equal width on phones, no scrolling needed */}
              <div className="bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm flex gap-1 w-full sm:w-auto dark:bg-slate-800 dark:border-slate-700 dark:shadow-none">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${tabBase} ${activeTab === "all" ? tabOn : tabOff}`}
                >
                  All<span className="hidden sm:inline"> Tasks</span> ({tasks.length})
                </button>

                <button
                  onClick={() => setActiveTab("pending")}
                  className={`${tabBase} flex items-center justify-center gap-1.5 ${
                    activeTab === "pending" ? tabOn : tabOff
                  }`}
                >
                  Active<span className="hidden sm:inline"> Tasks</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {pendingCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("completed")}
                  className={`${tabBase} ${activeTab === "completed" ? tabOn : tabOff}`}
                >
                  <span className="sm:hidden">Done</span>
                  <span className="hidden sm:inline">Completed</span> ({completedCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                {/* text-base on phones stops iOS from zooming the page when the field is focused */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by zone or task..."
                  className="w-full bg-white sm:bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-xs font-medium focus:outline-none focus:border-[#0a2e27] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            {loading && <p className="text-sm text-gray-500 font-medium dark:text-slate-400">Loading tasks...</p>}
            {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}

            {!loading && (
              <TasksSection
                tasks={filteredTasks}
                onViewDetails={(task) => setSelectedId(task.id)}
                pendingCount={pendingCount}
              />
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedId(null)}
          onStart={handleStart}
          onToggleItem={toggle}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}