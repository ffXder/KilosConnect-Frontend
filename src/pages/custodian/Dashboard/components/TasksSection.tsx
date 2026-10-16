import React from "react";
import { Check } from "lucide-react";
import type { TaskItem } from "../../TaskOperation/TaskDetailsModal";
import { formatTo12Hour } from "../../../../utils/formatter";

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
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-50">
          Today's Tasks
        </h3>
        <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
          {pendingCount} Tasks Remaining
        </span>
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
                  ? "border-gray-100 opacity-60 bg-gray-50/80 dark:bg-slate-900/70 dark:border-slate-700"
                  : "border-gray-100 hover:border-gray-300 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? "bg-[#0B3F57] border-[#0B3F57] text-white"
                      : "border-gray-300 hover:border-[#0B3F57] dark:border-slate-600 dark:hover:border-emerald-500"
                  }`}
                >
                  {isCompleted && <Check size={14} />}
                </div>

                <div className="min-w-0">
                  <p
                      className={`text-sm font-bold text-gray-900 truncate dark:text-slate-50 ${
                      isCompleted ? "line-through text-gray-400 dark:text-slate-500" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium mt-0.5">
                    {task.zone} · {formatTo12Hour(task.startTime)} – {formatTo12Hour(task.dueDate)}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-3 py-1 rounded-full shrink-0 tracking-wider uppercase ${
                  isCompleted
                    ? "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                    : task.status === "Missed" || task.status === "Disputed"
                    ? "bg-red-100 text-red-800 dark:bg-rose-950 dark:text-rose-200"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                }`}
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
