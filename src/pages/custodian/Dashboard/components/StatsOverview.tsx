import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListTodo, CheckCircle, Users, X, MapPin } from "lucide-react";
import type { TaskItem } from "../../TaskOperation/TaskDetailsModal";

interface StatsProps {
  pendingCount: number;
  completedCount: number;
  reviewCount: number;
  onTabChange: (tab: "all" | "pending" | "completed") => void;
  tasks: TaskItem[];
  onViewDetails: (task: TaskItem) => void;
}

export const StatsOverview: React.FC<StatsProps> = ({
  pendingCount,
  completedCount,
  reviewCount,
  onTabChange,
  tasks,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<"pending" | "completed" | null>(null);

  const card =
    "bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:gap-4 gap-1.5 text-center sm:text-left cursor-pointer hover:shadow-md hover:border-gray-200 active:scale-[0.98] dark:bg-slate-900 transition-all duration-300 dark:border-slate-700 dark:shadow-none";

  const popupTasks = tasks.filter((t) =>
    modalType === "pending"
      ? t.status === "Pending" || t.status === "In Progress"
      : t.status === "Completed"
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Pending Tasks */}
        <div
          onClick={() => { setModalType("pending"); onTabChange("pending"); }}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none"
        >
          <div className="p-3 bg-[#E6F4EA] text-[#0a2e27] rounded-xl shrink-0 dark:bg-emerald-950 dark:text-emerald-300">
            <ListTodo size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-50">{pendingCount}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5 dark:text-slate-300">Tasks Today</p>
          </div>
        </div>

        {/* Completed Count */}
        <div
          onClick={() => { setModalType("completed"); onTabChange("completed"); }}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-50">{completedCount}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5 dark:text-slate-300">Completed</p>
          </div>
        </div>

        {/* To Review */}
        <div
          onClick={() => navigate("/buddy-system")}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 dark:bg-amber-950 dark:text-amber-300">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-50">3</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5 dark:text-slate-300">To Review</p>
          </div>
        </div>
      </div>

      {/* Task list popup: bottom sheet on phones, centered card on larger screens */}
      {modalType && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border dark:border-slate-700">
            <div className="bg-[#0a2e27] p-6 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                  {modalType === "pending" ? (
                    <><ListTodo size={20} /> Active Tasks</>
                  ) : (
                    <><CheckCircle size={20} /> Completed Tasks</>
                  )}
                </h3>
                <p className="text-xs font-medium text-white/60 mt-0.5">
                  {modalType === "pending" ? pendingCount : completedCount}{" "}
                  {modalType === "pending" ? "Tasks Remaining" : "Total Completed"}
                </p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-2 -mr-2 text-white/60 hover:text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {popupTasks.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-slate-500 font-medium text-center py-6">
                  Nothing here yet.
                </p>
              )}
              {popupTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => { setModalType(null); onViewDetails(task); }}
                  className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer active:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:shadow-none dark:active:bg-slate-700 transition-colors"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    modalType === "pending"
                      ? "bg-[#E6F4EA] text-[#0a2e27] dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}>
                    {modalType === "pending" ? <ListTodo size={18} /> : <CheckCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm line-clamp-2">{task.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-gray-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {task.zone}</span>
                      <span>·</span>
                      <span>{task.dueDate}</span>
                    </div>
                    <span className={`inline-block mt-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      task.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};