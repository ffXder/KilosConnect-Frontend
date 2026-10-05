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
<div className={`flex items-center gap-6 p-7 border rounded-2xl flex-1 shadow-sm transition-all hover:shadow-md dark:shadow-none ${cardBg}`}>
    <div className={`w-14 h-14 flex items-center justify-center rounded-[18px] ${iconBg} shrink-0`}>
      <Icon size={24} className={color} />
    </div>
    <div className="flex flex-col">
      <div className="text-[30px] font-bold text-[#1a1a1a] leading-none tracking-tight dark:text-slate-50">
        {count}
      </div>
      <div className="text-[14px] text-[#64748b] font-semibold mt-1 dark:text-slate-300">
        {label}
      </div>
    </div>
  </div>
);