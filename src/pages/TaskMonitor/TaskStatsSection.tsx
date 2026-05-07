import React from 'react';
import { CheckCircle2, Clock, PieChart } from 'lucide-react';

interface TaskStatsProps {
  tasks: any[];
}

const TaskStatsSection: React.FC<TaskStatsProps> = ({ tasks }) => {
  const dailyTasks = tasks.filter(t => t.frequency === 'Daily');
  const completed = dailyTasks.filter(t => t.status === 'Completed').length;
  const pending = dailyTasks.filter(t => t.status === 'Pending').length;
  const total = dailyTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: 'COMPLETED TODAY', value: completed, icon: <CheckCircle2 size={20} />, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'PENDING TASKS', value: pending, icon: <Clock size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'COMPLETION RATE (DAILY)', value: `${percentage}%`, icon: <PieChart size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Reduced gap from 6 to 4 */}
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