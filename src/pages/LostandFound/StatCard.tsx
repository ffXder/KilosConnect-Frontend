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
<div className="flex items-center gap-4 p-5 bg-white border border-[#e2e8f0] rounded-[28px] flex-1 shadow-sm transition-all hover:shadow-md">
    <div className={`w-12 h-12 flex items-center justify-center rounded-[18px] ${iconBg} shrink-0`}>
      <Icon size={24} className={color} />
    </div>
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-[#1a1a1a] leading-none tracking-tight">
        {count}
      </div>
      <div className="text-[14px] text-[#64748b] font-semibold mt-1">
        {label}
      </div>
    </div>
  </div>
);