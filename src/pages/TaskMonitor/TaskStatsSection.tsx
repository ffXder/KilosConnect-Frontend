import React from 'react';
import { CheckCircle2, Clock, PieChart } from 'lucide-react';
import type { TaskLog } from '../../types/task'; // Import your type

interface TaskStatsProps {
  tasks: TaskLog[]; // Updated from any[] to TaskLog[]
}

const TaskStatsSection: React.FC<TaskStatsProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 italic text-gray-400">No data for selected filters...</div>;
  }

  // Calculate based on the tasks passed in (which should be your filtered list)
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: 'COMPLETED', value: completed, icon: <CheckCircle2 size={20} />, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'PENDING', value: pending, icon: <Clock size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'COMPLETION RATE', value: `${percentage}%`, icon: <PieChart size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>{stat.icon}</div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-[#0f172a]">{stat.value}</p>
              <p className="text-[15px] font-semibold text-gray-400 tracking-wider uppercase">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStatsSection;