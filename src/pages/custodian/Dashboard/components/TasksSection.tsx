import React from "react";
import { Check } from "lucide-react";
import type { TaskItem } from "../../TaskOperation/TaskDetailsModal";
import { formatTime } from "../../../../utils/formatter";

interface TasksProps {
  tasks: TaskItem[];
  onViewDetails: (task: TaskItem) => void;
  pendingCount: number;
}

const getStatusStyle = (status: TaskItem["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300";
    case "Missed":
    case "Disputed":
      return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300";
    default: // Pending, Pending Review
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
  }
};

export const TasksSection: React.FC<TasksProps> = ({
  tasks,
  onViewDetails,
  pendingCount,
}) => {
  return (
    <div className="font-['Poppins']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-slate-50">Today's Tasks</h3>
        <span className="text-xs font-bold text-gray-500 dark:text-slate-400">{pendingCount} Remaining</span>
      </div>

      {tasks.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-slate-400 font-medium mt-0.5 truncate">
          No tasks found.
        </p>
      )}

      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.status === "Completed";

          return (
            <div
              key={task.id}
              onClick={() => onViewDetails(task)}
              className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isCompleted
                  ? "border-gray-100 bg-gray-50/80 opacity-60 dark:border-slate-800 dark:bg-slate-900/60"
                  : "border-gray-100 bg-white hover:border-gray-300 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? "bg-[#0a2e27] border-[#0a2e27] text-white dark:bg-emerald-400 dark:border-emerald-400 dark:text-slate-900"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  {isCompleted && <Check size={14} />}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold truncate ${
                      isCompleted
                        ? "line-through text-gray-400 dark:text-slate-500"
                        : "text-gray-900 dark:text-slate-50"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium mt-0.5">
                    {task.zone} · {formatTime(task.startTime)} – {formatTime(task.dueDate)}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2.5 sm:px-3 py-1 rounded-full shrink-0 tracking-wider uppercase ${getStatusStyle(task.status)}`}
              >
                {isCompleted ? "Done" : task.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};