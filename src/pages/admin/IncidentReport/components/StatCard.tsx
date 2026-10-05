import React from 'react';
import { AlertTriangle, CheckCircle2, CircleDashed, ShieldAlert, Boxes } from 'lucide-react';

interface StatsCardsProps {
  total: number;
  openCount: number;
  resolvedCount: number;
  highCount: number;
  lowCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  total,
  openCount,
  resolvedCount,
  highCount,
  lowCount,
}) => {
  const stats = [
    { label: 'Total', value: total, cardClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800', iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700', icon: Boxes },
    { label: 'Open', value: openCount, cardClass: 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800', iconClass: 'bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700', icon: CircleDashed },
    { label: 'Resolved', value: resolvedCount, cardClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800', iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-200 dark:text-emerald-700', icon: CheckCircle2 },
    { label: 'High', value: highCount, cardClass: 'bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800', iconClass: 'bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-700', icon: AlertTriangle },
    { label: 'Low', value: lowCount, cardClass: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800', iconClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-200 dark:text-indigo-700', icon: ShieldAlert },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3 lg:gap-5">
      {stats.map(({ label, value, cardClass, iconClass, icon: Icon }) => (
        <div
          key={label}
          className={`border p-2 sm:p-3 md:p-4 lg:p-5 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 ${cardClass} dark:shadow-none transition-colors duration-300`}
        >
          <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
            <Icon size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-tight dark:text-slate-50 font-bold">{value}</div>
            <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium truncate dark:text-slate-400">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;