import React from "react";
import { Activity, AlertTriangle, Archive, Box, ShieldAlert, Wrench } from "lucide-react";
import type { Asset } from "../../../../types/asset";

interface Props {
  assets: Asset[];
}

export const AssetRegistryStats: React.FC<Props> = ({ assets }) => {
  const total = assets.length;
  const working = assets.filter((a) => a.condition === "Working").length;
  const needsRepair = assets.filter((a) => a.condition === "Needs Repair").length;
  const damaged = assets.filter((a) => a.condition === "Damaged").length;
  const underRepair = assets.filter((a) => a.condition === "Under Repair").length;
  const hazardous = assets.filter((a) => a.condition === "Hazardous").length;
  const decommissioned = assets.filter((a) => a.condition === "Decommissioned").length;

  const topStats = [
    {
      label: "Total Assets",
      count: total,
      cardClass: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
      iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700",
      icon: Box,
    },
    {
      label: "Working",
      count: working,
      cardClass: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800",
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-200 dark:text-emerald-700",
      icon: Activity,
    },
    {
      label: "Needs Repair",
      count: needsRepair,
      cardClass: "bg-white border-slate-200 dark:bg-slate-800/40 dark:border-slate-700",
      iconClass: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
      icon: Wrench,
    },
  ];

  const bottomStats = [
    {
      label: "Under Repair",
      count: underRepair,
      cardClass: "bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-800",
      iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-200 dark:text-sky-700",
      icon: Wrench,
    },
    {
      label: "Damaged",
      count: damaged,
      cardClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
      iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-200 dark:text-amber-700",
      icon: AlertTriangle,
    },
    {
      label: "Hazardous",
      count: hazardous,
      cardClass: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800",
      iconClass: "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700",
      icon: ShieldAlert,
    },
    {
      label: "Decommissioned",
      count: decommissioned,
      cardClass: "bg-black border-slate-900 dark:bg-white dark:border-slate-300",
      iconClass: "bg-black text-white shadow-md dark:bg-white dark:text-black",
      textClass: "text-white dark:text-black",
      icon: Archive,
    },
  ];

  const renderCard = (
    stat: (typeof topStats)[number] | (typeof bottomStats)[number],
    compact = false,
  ) => {
    const { label, count, cardClass, iconClass, icon: Icon } = stat;
    const textClass = "textClass" in stat ? stat.textClass : undefined;

    return (
      <div
        key={label}
        className={`border ${compact ? "p-1.5 sm:p-2.5 md:p-3 lg:p-4" : "p-2 sm:p-3 md:p-4 lg:p-5"} rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 ${cardClass} dark:shadow-none transition-colors duration-300`}
      >
        <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
          <Icon size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight ${textClass ?? "text-gray-800 dark:text-slate-50"}`}>{count}</div>
          <div className={`text-[10px] sm:text-xs md:text-sm font-medium truncate ${textClass ?? "text-gray-500 dark:text-slate-400"}`}>{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2 md:space-y-3 lg:space-y-5 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-5">
        {topStats.map(renderCard)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-5">
        {bottomStats.map((stat) => renderCard(stat, true))}
      </div>
    </div>
  );
};