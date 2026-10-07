import React from 'react';
import { MapPin, Clock, ChevronRight, User, AlertCircle } from 'lucide-react';
import type { TaskItem } from './TaskDetailsModal';

interface TaskListProps {
  tasks: TaskItem[];
  onViewDetails: (task: TaskItem) => void;
}

export default function TaskList({ tasks, onViewDetails }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center font-['Poppins'] dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
        <AlertCircle className="mx-auto text-gray-400 mb-2 dark:text-slate-400" size={32} />
        <p className="text-sm font-medium text-gray-500 dark:text-slate-300">No tasks found matching this filter.</p>
      </div>
    );
  }

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900';
    }
  };

  const getStatusBadge = (status: TaskItem['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100 border dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-100 border dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900';
      case 'Disputed':
      case 'Missed':
        return 'bg-rose-50 text-rose-800 border-rose-100 border dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900';
      default:
        return 'bg-[#f8fafc] text-gray-700 border-[#e2e8f0] border dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600';
    }
  };

  return (
    <div className="space-y-4 font-['Poppins']">
      {tasks.map((task) => {
        const completedCount = task.checklist.filter(c => c.completed).length;

        return (
          <div
            key={task.id}
            onClick={() => onViewDetails(task)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-[#e2e8f0] transition cursor-pointer p-4 sm:p-5 flex items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none"
          >
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-[#0a2e27] shrink-0 mt-1 dark:bg-emerald-950 dark:text-emerald-300">
                <MapPin size={22} />
              </div>

              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 text-sm sm:text-base dark:text-slate-50">{task.title}</h4>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium flex-wrap dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <User size={14} /> {task.startedBy || "Not Started Yet"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {task.dueDate}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900">
                    {task.zone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 font-medium dark:text-slate-400">Checklist</p>
                <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{completedCount}/{task.checklist.length}</p>
              </div>
              <ChevronRight size={22} className="text-gray-400 dark:text-slate-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}