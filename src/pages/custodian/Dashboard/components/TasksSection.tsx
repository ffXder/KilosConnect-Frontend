import React from "react";
import { Check } from "lucide-react";
import type { TaskItem } from "../../TaskOperation/TaskDetailsModal";

interface TasksProps {
  tasks: TaskItem[];
  onViewDetails: (task: TaskItem) => void;
  pendingCount: number;
}

export const TasksSection: React.FC<TasksProps> = ({
  tasks,
  onViewDetails,
  pendingCount,
}) => {
  return (
    <div className="font-['Poppins']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-gray-900">
          Today's Tasks
        </h3>
        <span className="text-xs font-bold text-gray-500">
          {pendingCount} Tasks Remaining
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.status === "Completed";

          return (
            <div
              key={task.id}
              onClick={() => onViewDetails(task)}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isCompleted
                  ? "border-gray-100 opacity-60 bg-gray-50/80"
                  : "border-gray-100 hover:border-gray-300 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(task);
                  }}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-[#0a2e27] border-[#0a2e27] text-white"
                      : "border-gray-300 hover:border-[#0a2e27]"
                  }`}
                >
                  {isCompleted && <Check size={14} />}
                </button>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold text-gray-900 truncate ${
                      isCompleted ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {task.zone} · {task.dueDate}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-3 py-1 rounded-full shrink-0 tracking-wider uppercase ${
                  isCompleted
                    ? "bg-gray-200 text-gray-600"
                    : task.status === "Flagged"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isCompleted ? "DONE" : task.status.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};