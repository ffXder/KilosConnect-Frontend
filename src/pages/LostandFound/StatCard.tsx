import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  color: string;
  iconBg: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ label, count, color, iconBg, icon: Icon }) => (
<div className="flex items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-5 lg:p-7 bg-white border border-[#e2e8f0] rounded-[16px] sm:rounded-[20px] lg:rounded-[28px] flex-1 shadow-sm transition-all hover:shadow-md">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-[12px] sm:rounded-[14px] lg:rounded-[18px] ${iconBg} shrink-0`}>
      <Icon size={20} className={`sm:hidden ${color}`} />
      <Icon size={24} className={`hidden sm:block ${color}`} />
    </div>
    <div className="flex flex-col">
      <div className="text-xl sm:text-2xl md:text-[30px] font-bold text-[#1a1a1a] leading-none tracking-tight">
        {count}
      </div>
      <div className="text-xs sm:text-[14px] text-[#64748b] font-semibold mt-0.5 sm:mt-1">
        {label}
      </div>
    </div>
  </div>
);
