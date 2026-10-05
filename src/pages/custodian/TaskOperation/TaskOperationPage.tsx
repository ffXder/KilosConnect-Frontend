import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { Clock, AlertCircle, CheckCircle2, Search } from "lucide-react";
import TaskList from "./TaskList";
import TaskDetailsModal from "./TaskDetailsModal";
import { useTodayTasks } from "../../../hooks/useTodayTask"

export default function TaskMain() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // data + actions come from the hook
  const { tasks, summary, loading, error, start, toggle, complete } = useTodayTasks();

  // always look up the open task from fresh data so the modal updates after each action
  const selectedTask = tasks.find(t => t.id === selectedId) ?? null;

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

  // ── Tab + search filtering ────────────────────────────────────────────────
  const filteredTasks = tasks.filter(task => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(q) ||
      task.zone.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (activeTab === "pending")   return task.status === "Pending" || task.status === "In Progress";
    if (activeTab === "completed") return task.status === "Completed";
    return true; // "all" tab
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] flex-col md:flex-row font-['Poppins'] dark:bg-slate-950 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <div
        className={`transition-all duration-300 p-4 pt-20 sm:p-6 sm:pt-24 md:p-8 flex-1 min-w-0 ${
          sidebarExpanded ? "md:ml-[15px]" : "md:ml-[15px]"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-slate-50">
                Task Operations
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 dark:text-slate-300">
                Manage daily facility maintenance and zone tasks
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-slate-700 gap-0 sm:gap-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none justify-center py-3 sm:py-3.5 px-2 sm:px-1 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap text-sm sm:text-base font-bold ${
                activeTab === "all"
                  ? "border-[#0a2e27] text-[#0a2e27] dark:border-emerald-500 dark:text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Facility Tasks
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 sm:flex-none justify-center py-3 sm:py-3.5 px-2 sm:px-1 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap text-sm sm:text-base font-bold ${
                activeTab === "pending"
                  ? "border-[#0a2e27] text-[#0a2e27] dark:border-emerald-500 dark:text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Active Queue
              <span
                className={`text-[11px] sm:text-xs min-w-[22px] text-center px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "pending"
                    ? "bg-[#0a2e27] text-white dark:bg-emerald-500 dark:text-slate-900"
                    : "bg-[#e6f0ef] text-[#0a2e27] dark:bg-slate-700 dark:text-slate-200"
                }`}
              >
                {summary.activePending}
              </span>
            </button>
          </div>

          {/* Stats Cards (numbers come from the backend summary) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border dark:border-slate-700">
              <div className="p-3 bg-emerald-50 text-[#0a2e27] rounded-xl shrink-0 dark:text-slate-900">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-300">Active / Pending Tasks</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50">{summary.activePending}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border dark:border-slate-700">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-300">Flagged Issues</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50">{summary.flagged}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border dark:border-slate-700">
              <div className="p-3 bg-emerald-50 text-[#0a2e27] rounded-xl shrink-0 dark:text-slate-900">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-300">Completed Today</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50">{summary.completed}</h3>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border dark:border-slate-700">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by zone or task name..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0a2e27] dark:bg-slate-800 dark:border-slate-600 transition-colors duration-300 dark:placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Loading / error states */}
          {loading && <p className="text-sm text-gray-500 font-medium">Loading tasks...</p>}
          {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}

          {/* Task list */}
          {!loading && (
            <TaskList
              tasks={filteredTasks}
              onViewDetails={(task) => setSelectedId(task.id)}
            />
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedId(null)}
          onStart={start}
          onToggleItem={toggle}
          onComplete={complete}
        />
      )}
    </div>
  );
}