import React from 'react';
import { AlertCircle, CheckCircle2, Clock, PieChart, PlayCircle } from 'lucide-react';
import type { TaskLog } from '../../../types/task'; // Import your type

interface TaskStatsProps {
  tasks: TaskLog[]; // Updated from any[] to TaskLog[]
}

const TaskStatsSection: React.FC<TaskStatsProps> = ({ tasks }) => {

  // Calculate based on the tasks passed in (which should be your filtered list)
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const missed = tasks.filter(t => t.status === 'Missed').length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Completed',
      value: completed,
      icon: <CheckCircle2 size={20} />,
      iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-200 dark:text-emerald-700',
      cardClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800',
    },
    {
      label: 'Pending',
      value: pending,
      icon: <Clock size={20} />,
      iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-200 dark:text-amber-700',
      cardClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: <PlayCircle size={20} />,
      iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700',
      cardClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800',
    },
    {
      label: 'Missed',
      value: missed,
      icon: <AlertCircle size={20} />,
      iconClass: 'bg-rose-100 text-rose-600 dark:bg-rose-200 dark:text-rose-700',
      cardClass: 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800',
    },
    {
      label: 'Completion Rate',
      value: `${percentage}%`,
      icon: <PieChart size={20} />,
      iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700',
      cardClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <div key={index} className={`p-6 rounded-2xl border flex items-center gap-4 shadow-sm transition-colors duration-300 dark:shadow-none ${stat.cardClass}`}>
          <div className={`${stat.iconClass} p-3 rounded-xl`}>{stat.icon}</div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-[#0f172a] dark:text-slate-100 sm:text-lg md:text-xl lg:text-2xl">
              {stat.value}
            </p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-slate-400 sm:text-xs md:text-sm">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStatsSection;