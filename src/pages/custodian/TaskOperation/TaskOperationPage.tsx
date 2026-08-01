import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { Clock, AlertCircle, CheckCircle2, Search } from "lucide-react";
import TaskList from "./TaskList";
import TaskDetailsModal, { type TaskItem } from "./TaskDetailsModal";

export default function TaskMain() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

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

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "TK-101",
      title: "Powerlifting Rack Sanitization & Bolt Inspection",
      zone: "Powerlifting Area",
      assignedTo: "Custodian #3",
      priority: "High",
      status: "Pending",
      dueDate: "Today, 09:00 AM",
      checklist: [
        { id: 1, text: "Inspect safety pins and barbell collars", completed: true },
        { id: 2, text: "Sanitize vinyl benches and handles", completed: true },
        { id: 3, text: "Tighten loose upright bolts", completed: false },
        { id: 4, text: "Re-rack weight plates", completed: false }
      ]
    },
    {
      id: "TK-102",
      title: "Assault Bike & Rower Maintenance",
      zone: "CrossFit Area",
      assignedTo: "Custodian #5",
      priority: "Medium",
      status: "In Progress",
      dueDate: "Today, 10:30 AM",
      checklist: [
        { id: 1, text: "Check rower chain tension and oil", completed: true },
        { id: 2, text: "Wipe down monitor console", completed: true },
        { id: 3, text: "Inspect pedal straps", completed: false }
      ]
    },
    {
      id: "TK-103",
      title: "Rubber Mat Deep Clean & Floor Wash",
      zone: "WOD Area",
      assignedTo: "Custodian #2",
      priority: "Low",
      status: "Completed",
      dueDate: "Today, 07:00 AM",
      checklist: [
        { id: 1, text: "Sweep chalk dust from surface", completed: true },
        { id: 2, text: "Mop with disinfectant solution", completed: true }
      ]
    },
    {
      id: "TK-104",
      title: "Dumbbell Rack Re-ordering & Safety Check",
      zone: "Free Weights",
      assignedTo: "Custodian #6",
      priority: "High",
      status: "Pending",
      dueDate: "Today, 11:45 AM",
      checklist: [
        { id: 1, text: "Organize pairs in ascending weight order", completed: false },
        { id: 2, text: "Wipe rubber dumbbell heads", completed: false },
        { id: 3, text: "Report cracked rubber coating", completed: false }
      ]
    }
  ]);

  const handleStatusChange = (taskId: string, newStatus: TaskItem["status"]) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // ── Tab filtering ──────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.zone.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "pending")   return task.status === "Pending" || task.status === "In Progress";
    if (activeTab === "completed") return task.status === "Completed";
    return true; // "all" tab — show everything
  });

  const pendingCount   = tasks.filter(t => t.status === "Pending" || t.status === "In Progress").length;
  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const flaggedCount   = tasks.filter(t => t.status === "Flagged").length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] flex-col md:flex-row font-['Poppins']">
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
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Task Operations
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Manage daily facility maintenance and zone tasks
              </p>
            </div>
          </div>

          {/* Tabs — clicking each sets activeTab; filteredTasks reacts automatically */}
          <div className="flex border-b border-gray-200 gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "border-[#0a2e27] text-[#0a2e27]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Facility Tasks
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 -mb-px border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "pending"
                  ? "border-[#0a2e27] text-[#0a2e27]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Active Queue
              <span
                className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "pending"
                    ? "bg-[#0a2e27] text-white"
                    : "bg-[#e6f0ef] text-[#0a2e27]"
                }`}
              >
                {pendingCount}
              </span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-[#0a2e27] rounded-xl shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Active / Pending Tasks</p>
                <h3 className="text-xl font-bold text-gray-900">{pendingCount}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Flagged Issues</p>
                <h3 className="text-xl font-bold text-gray-900">{flaggedCount}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-[#0a2e27] rounded-xl shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Completed Today</p>
                <h3 className="text-xl font-bold text-gray-900">{completedCount}</h3>
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
                placeholder="Search by zone, task name, or ID..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0a2e27]"
              />
            </div>
          </div>

          {/* Task list — receives only the tasks that pass the active tab + search filter */}
          <TaskList
            tasks={filteredTasks}
            onViewDetails={(task) => setSelectedTask(task)}
          />
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}