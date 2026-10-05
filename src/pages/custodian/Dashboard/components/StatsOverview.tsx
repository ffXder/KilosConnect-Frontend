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
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* Active tasks */}
        <div onClick={() => { setModalType("pending"); onTabChange("pending"); }} className={card}>
          <div className="p-2 sm:p-3 bg-[#E6F4EA] text-[#0a2e27] rounded-xl shrink-0">
            <ListTodo className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none text-gray-900 dark:text-slate-100">{pendingCount}</p>
            <p className="text-[11px] sm:text-xs font-medium text-gray-500 mt-1 sm:mt-0.5 dark:text-slate-300">
              <span className="sm:hidden">Active</span>
              <span className="hidden sm:inline">Tasks Today</span>
            </p>
          </div>
        </div>

        {/* Completed */}
        <div onClick={() => { setModalType("completed"); onTabChange("completed"); }} className={card}>
          <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none text-gray-900 dark:text-slate-100">{completedCount}</p>
            <p className="text-[11px] sm:text-xs font-medium text-gray-500 mt-1 sm:mt-0.5 dark:text-slate-300">
              <span className="sm:hidden">Done</span>
              <span className="hidden sm:inline">Completed</span>
            </p>
          </div>
        </div>

        {/* To review (real count) */}
        <div onClick={() => navigate("/custodian/buddy-system")} className={card}>
          <div className="p-2 sm:p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Users className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none text-gray-900 dark:text-slate-100">{reviewCount}</p>
            <p className="text-[11px] sm:text-xs font-medium text-gray-500 mt-1 sm:mt-0.5 dark:text-slate-300">To Review</p>
          </div>
        </div>
      </div>

      {/* Task list popup: bottom sheet on phones, centered card on larger screens */}
      {modalType && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setModalType(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-[32px] sm:max-w-lg w-full shadow-xl overflow-hidden flex flex-col max-h-[85dvh] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
          >
            <div className="bg-[#0a2e27] px-5 py-4 sm:p-6 flex items-center justify-between shrink-0">
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
                  className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer active:bg-gray-50 dark:active:bg-slate-700 transition-colors"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    modalType === "pending"
                      ? "bg-[#E6F4EA] text-[#0a2e27]"
                      : "bg-emerald-50 text-emerald-600"
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
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
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