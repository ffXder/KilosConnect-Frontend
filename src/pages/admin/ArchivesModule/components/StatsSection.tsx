import React from "react";
import type { ArchiveStats } from "../../../../types/archive";

const ArchivesStatsSection: React.FC<{ stats: ArchiveStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <span className="text-xs font-medium text-[#64748b] dark:text-slate-300">Total Archived</span>
        <div className="text-2xl font-bold text-[#0f172a] mt-1.5 dark:text-slate-100">
          {stats?.total ?? 0}
        </div>
      </div>

      <div className="bg-[#fff5f5] border border-[#fecaca] p-5 rounded-2xl shadow-sm dark:bg-red-950/40 dark:border-red-800">
        <span className="text-xs font-semibold text-[#ef4444] dark:text-red-300">Incidents</span>
        <div className="text-2xl font-bold text-[#ef4444] mt-1.5 dark:text-red-300">
          {stats?.byModule?.IncidentReport ?? 0}
        </div>
      </div>

      <div className="bg-[#f2fdf7] border border-[#bbf7d0] p-5 rounded-2xl shadow-sm dark:bg-emerald-950/40 dark:border-emerald-800">
        <span className="text-xs font-semibold text-[#22c55e] dark:text-emerald-300">Task</span>
        <div className="text-2xl font-bold text-[#22c55e] mt-1.5 dark:text-emerald-300">
          {stats?.byModule?.Task ?? 0}
        </div>
      </div>

      <div className="bg-[#f0f7ff] border border-[#bfdbfe] p-5 rounded-2xl shadow-sm dark:bg-blue-950/40 dark:border-blue-800">
        <span className="text-xs font-semibold text-[#3b82f6] dark:text-blue-300">Assets</span>
        <div className="text-2xl font-bold text-[#3b82f6] mt-1.5 dark:text-blue-300">
          {stats?.byModule?.Asset ?? 0}
        </div>
      </div>
    </div>
  );
};

export default ArchivesStatsSection;