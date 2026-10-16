import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  color: string;
  iconBg: string;
  cardBg: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ label, count, color, iconBg, cardBg, icon: Icon }) => (
<div className={`flex min-w-0 items-center gap-2 rounded-2xl border p-2 shadow-sm transition-colors duration-300 dark:shadow-none sm:gap-3 sm:p-3 md:gap-4 md:p-4 lg:p-5 ${cardBg}`}>
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 sm:rounded-xl md:h-10 md:w-10 lg:h-12 lg:w-12 ${iconBg}`}>
      <Icon size={16} strokeWidth={2} className={`sm:size-[20px] md:size-[24px] lg:size-[28px] ${color}`} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-sm font-bold leading-tight text-[#1a1a1a] dark:text-slate-50 sm:text-lg md:text-xl lg:text-2xl">
        {count}
      </div>
      <div className="truncate text-[10px] font-medium text-[#64748b] dark:text-slate-300 sm:text-xs md:text-sm">
        {label}
      </div>
    </div>
  </div>
);