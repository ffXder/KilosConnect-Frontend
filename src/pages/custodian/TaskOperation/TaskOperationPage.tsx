import React, { useState } from "react";
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

      <main className="flex-1 w-full min-w-0 p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden">
        <div className="space-y-6">

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
          <div className="flex border-b border-gray-200 gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "border-[#0a2e27] text-[#0a2e27] dark:text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-300"
              }`}
            >
              Facility Tasks
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "pending"
                  ? "border-[#0a2e27] text-[#0a2e27] dark:text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:text-slate-300"
              }`}
            >
              Active Queue
              <span
                className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "pending"
                    ? "bg-[#0a2e27] text-white dark:text-emerald-400"
                    : "bg-[#e6f0ef] text-[#0a2e27]"
                }`}
              >
                {summary.activePending}
              </span>
            </button>
          </div>

          {/* Stats Cards (numbers come from the backend summary) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-[#0a2e27] rounded-xl shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Active / Pending Tasks</p>
                <h3 className="text-xl font-bold text-gray-900">{summary.activePending}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Flagged Issues</p>
                <h3 className="text-xl font-bold text-gray-900">{summary.flagged}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-[#0a2e27] rounded-xl shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Completed Today</p>
                <h3 className="text-xl font-bold text-gray-900">{summary.completed}</h3>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by zone or task name..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0a2e27]"
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
      </main>

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