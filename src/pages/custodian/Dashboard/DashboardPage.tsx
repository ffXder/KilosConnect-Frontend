import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { StatsOverview } from "./components/StatsOverview";
import { BuddyBanner } from "./components/BuddyBanner";
import { QuickActions } from "./components/QuickActions";
import { TasksSection } from "./components/TasksSection";
import { CheckCircle, Search } from "lucide-react";
import TaskDetailsModal, { type TaskItem } from "../TaskOperation/TaskDetailsModal";

export default function CustodianDashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "TK-101",
      title: "Sanitize Powerlifting Racks & Plates",
      zone: "Powerlifting Area",
      assignedTo: "Custodian John",
      priority: "High",
      status: "Pending",
      dueDate: "09:00 AM",
      checklist: [
        { id: 1, text: "Inspect safety pins and barbell collars", completed: false },
        { id: 2, text: "Sanitize vinyl benches and handles", completed: false }
      ]
    },
    {
      id: "TK-102",
      title: "Inspect CrossFit Rig & Carabiners",
      zone: "CrossFit Area",
      assignedTo: "Custodian John",
      priority: "Medium",
      status: "Pending",
      dueDate: "11:30 AM",
      checklist: [
        { id: 1, text: "Check rig stability and bolts", completed: false },
        { id: 2, text: "Inspect carabiners for wear and tear", completed: false }
      ]
    },
    {
      id: "TK-103",
      title: "Refill Disinfectant Spray Stations",
      zone: "WOD Area",
      assignedTo: "Custodian John",
      priority: "Low",
      status: "Completed",
      dueDate: "02:00 PM",
      checklist: [
        { id: 1, text: "Refill all 5 spray bottles", completed: true },
        { id: 2, text: "Restock paper towel dispensers", completed: true }
      ]
    },
  ]);

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          triggerToast(`Task "${t.title}" marked as ${newStatus}`);
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const pendingCount = tasks.filter((t) => t.status === "Pending" || t.status === "In Progress").length;
  const completedCount = 42 + tasks.filter((t) => t.status === "Completed").length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.zone.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "pending") return task.status === "Pending" || task.status === "In Progress";
    if (activeTab === "completed") return task.status === "Completed";
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] flex-col md:flex-row font-['Poppins']">
      <SidebarNavigationSection userRole={userRole} />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a2e27] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-700/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle size={20} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      <div
        className={`transition-all duration-300 p-4 pt-20 sm:p-6 sm:pt-24 md:p-8 flex-1 min-w-0 ${
          sidebarExpanded ? "md:ml-[15px]" : "md:ml-[15px]"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back, John!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Ready to keep Kilos PH in top shape?
            </p>
          </div>

          {/* ← onViewDetails added so task cards in the popup open TaskDetailsModal */}
          <StatsOverview
            pendingCount={pendingCount}
            completedCount={completedCount}
            onTabChange={(tab) => setActiveTab(tab)}
            tasks={tasks}
            onViewDetails={(task) => setSelectedTask(task)}
          />

          <BuddyBanner />

          <QuickActions />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm flex gap-1 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`whitespace-nowrap py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'all'
                      ? 'bg-[#0a2e27] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  All Tasks ({tasks.length})
                </button>

                <button
                  onClick={() => setActiveTab('pending')}
                  className={`whitespace-nowrap py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'pending'
                      ? 'bg-[#0a2e27] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Active Tasks
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {pendingCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('completed')}
                  className={`whitespace-nowrap py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-[#0a2e27] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Completed ({tasks.filter((t) => t.status === "Completed").length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by zone or task..."
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0a2e27]"
                />
              </div>
            </div>

            <TasksSection
              tasks={filteredTasks}
              onViewDetails={(task) => setSelectedTask(task)}
              pendingCount={pendingCount}
            />
          </div>
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