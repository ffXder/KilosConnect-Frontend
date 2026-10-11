import React from 'react';
import { Activity, Boxes, ClipboardCheck, PackageSearch, ShieldAlert, UserRound, Wrench } from 'lucide-react';

interface LogsStatsSectionProps {
  stats?: Record<string, number>; // e.g. { Asset: 12, TaskLog: 5, IncidentReport: 3 }
  isLoading?: boolean;
}

export default function LogsStatsSection({ stats = {}, isLoading = false }: LogsStatsSectionProps) {
  const categories = [
    {
      label: "Asset Registry",
      count: stats["Asset"] || 0,
      cardClass: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
      iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700",
      icon: Boxes,
    },
    {
      label: "Task Log",
      count: stats["TaskLog"] || 0,
      cardClass: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800",
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-200 dark:text-emerald-700",
      icon: Activity,
    },
    {
      label: "Incident",
      count: (stats["IncidentReport"] || 0) + (stats["Incident Report"] || 0) + (stats["Incident"] || 0),
      cardClass: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800",
      iconClass: "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700",
      icon: ShieldAlert,
    },
    {
      label: "Lost & Found",
      count: (stats["LostAndFound"] || 0) + (stats["Lost And Found"] || 0) + (stats["Lost & Found"] || 0),
      cardClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
      iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-200 dark:text-amber-700",
      icon: PackageSearch,
    },
    {
      label: "Repair Log",
      count: stats["RepairLog"] || 0,
      cardClass: "bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-800",
      iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-200 dark:text-sky-700",
      icon: Wrench,
    },
    {
      label: "Task",
      count: stats["Task"] || 0,
      cardClass: "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800",
      iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-200 dark:text-violet-700",
      icon: ClipboardCheck,
    },
    {
      label: "User",
      count: stats["User"] || 0,
      cardClass: "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700",
      iconClass: "bg-slate-100 text-slate-600 dark:bg-slate-200 dark:text-slate-700",
      icon: UserRound,
    },
  ];

  const renderCard = ({ label, count, cardClass, iconClass, icon: Icon }: typeof categories[number]) => (
    <div
      key={label}
      className={`border p-2 sm:p-3 md:p-4 lg:p-5 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 ${cardClass} dark:shadow-none transition-colors duration-300`}
    >
      <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
        <Icon size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-tight dark:text-slate-50 font-bold">
          {isLoading ? "..." : count.toLocaleString()}
        </div>
        <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium truncate dark:text-slate-400">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2 md:space-y-3 lg:space-y-5 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 lg:gap-5">
        {categories.slice(0, 3).map(renderCard)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 lg:gap-5">
        {categories.slice(3).map(renderCard)}
      </div>
    </div>
  );
}