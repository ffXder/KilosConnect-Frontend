import React from 'react';
import type{ LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  color: string;
  iconBg: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ label, count, color, iconBg, icon: Icon }) => (
  <div className="flex items-center gap-5 p-6 bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm flex-1 font-sans">
    <div className={`w-12 h-12 flex items-center justify-center rounded-[10px] ${iconBg}`}>
      <Icon size={22} className={color} />
    </div>
    <div className="flex flex-col">
      <span className="text-[24px] font-semibold text-[#1a1a1a] leading-tight">{count}</span>
      <span className="text-[13px] text-[#64748b] font-normal mt-0.5">{label}</span>
    </div>
  </div>
);