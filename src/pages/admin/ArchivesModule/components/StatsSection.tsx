import React from "react";
import { Archive, ClipboardList, Package, PackageSearch, TriangleAlert, UsersRound } from "lucide-react";
import type { ArchiveStats } from "../../../../types/archive";

const ArchivesStatsSection: React.FC<{ stats: ArchiveStats }> = ({ stats }) => {
  const cards = [
    { label: "Total Archived", count: stats?.total ?? 0, cardClass: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800", iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700", icon: Archive },
    { label: "Incidents", count: stats?.byModule?.IncidentReport ?? 0, cardClass: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800", iconClass: "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700", icon: TriangleAlert },
    { label: "Tasks", count: stats?.byModule?.Task ?? 0, cardClass: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800", iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-200 dark:text-emerald-700", icon: ClipboardList },
    { label: "Assets", count: stats?.byModule?.Asset ?? 0, cardClass: "bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-800", iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-200 dark:text-sky-700", icon: Package },
    { label: "Users", count: stats?.byModule?.User ?? 0, cardClass: "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800", iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-200 dark:text-violet-700", icon: UsersRound },
    { label: "Lost & Found", count: stats?.byModule?.LostAndFound ?? 0, cardClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800", iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-200 dark:text-amber-700", icon: PackageSearch },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-5 mb-6">
      {cards.map(({ label, count, cardClass, iconClass, icon: Icon }) => (
        <div key={label} className={`border p-3 sm:p-4 lg:p-5 rounded-2xl shadow-sm flex items-center gap-3 min-w-0 dark:shadow-none transition-colors duration-300 ${cardClass}`}>
          <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
            <Icon size={18} strokeWidth={2} className="sm:size-5 lg:size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight dark:text-slate-50">{count}</div>
            <div className="text-gray-500 text-[10px] sm:text-xs font-medium truncate dark:text-slate-400">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchivesStatsSection;