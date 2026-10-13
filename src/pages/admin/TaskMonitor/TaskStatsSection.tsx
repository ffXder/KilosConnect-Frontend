import React from 'react';
import { CheckCircle2, Clock, PieChart } from 'lucide-react';
import type { TaskLog } from '../../../types/task'; // Import your type

interface TaskStatsProps {
  tasks: TaskLog[]; // Updated from any[] to TaskLog[]
}

const TaskStatsSection: React.FC<TaskStatsProps> = ({ tasks }) => {

  // Calculate based on the tasks passed in (which should be your filtered list)
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'COMPLETED',
      value: completed,
      icon: <CheckCircle2 size={20} />,
      iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-200 dark:text-emerald-700',
      cardClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800',
    },
    {
      label: 'PENDING',
      value: pending,
      icon: <Clock size={20} />,
      iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-200 dark:text-amber-700',
      cardClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800',
    },
    {
      label: 'COMPLETION RATE',
      value: `${percentage}%`,
      icon: <PieChart size={20} />,
      iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700',
      cardClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`p-6 rounded-2xl border flex items-center gap-4 shadow-sm transition-colors duration-300 dark:shadow-none ${stat.cardClass}`}>
          <div className={`${stat.iconClass} p-3 rounded-xl`}>{stat.icon}</div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-[#0f172a] dark:text-slate-100">{stat.value}</p>
              <p className="text-[15px] font-semibold text-gray-400 tracking-wider uppercase dark:text-slate-300">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStatsSection;