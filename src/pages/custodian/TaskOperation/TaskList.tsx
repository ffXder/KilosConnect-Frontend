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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center font-['Poppins']">
        <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-sm font-medium text-gray-500">No tasks found matching this filter.</p>
      </div>
    );
  }

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status: TaskItem['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100 border';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-100 border';
      case 'Flagged':
        return 'bg-rose-50 text-rose-800 border-rose-100 border';
      default:
        return 'bg-[#f8fafc] text-gray-700 border-[#e2e8f0] border';
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
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-[#e2e8f0] transition cursor-pointer p-4 sm:p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-[#0a2e27] shrink-0 mt-1">
                <MapPin size={22} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{task.title}</h4>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <User size={14} /> {task.assignedTo}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {task.dueDate}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {task.zone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 font-medium">Checklist</p>
                <p className="text-sm font-bold text-gray-800">{completedCount}/{task.checklist.length}</p>
              </div>
              <ChevronRight size={22} className="text-gray-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}