import React from "react";
import type { PerformanceStats } from "./ProfileMain";

const StatRow: React.FC<{ label: string; sublabel: string; value: number }> = ({ label, sublabel, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6] last:border-0 dark:border-slate-700">
    <div>
      <p className="text-sm text-[#111827] font-medium dark:text-slate-100">{label}</p>
      <p className="text-xs text-[#9ca3af] mt-0.5 dark:text-slate-400">{sublabel}</p>
    </div>
    <span className="text-[26px] font-bold text-[#1a3a30] leading-none dark:text-emerald-300">{value}</span>
  </div>
);

export const ProfileStatsSection: React.FC<{ stats: PerformanceStats }> = ({ stats }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 dark:bg-slate-900 dark:border-slate-700">
    <h2 className="text-base font-semibold text-[#0d1f1a] mb-2 dark:text-slate-100">Performance Stats</h2>
    <StatRow label="Tasks Completed" sublabel="This Month" value={stats.tasksCompleted} />
    <StatRow label="Incidents Reported" sublabel="This Month" value={stats.incidentsReported} />
    <StatRow label="Items Logged" sublabel="This Month" value={stats.itemsLogged} />
    <StatRow label="Active Days" sublabel="This Month" value={stats.activeDays} />
  </div>
);

