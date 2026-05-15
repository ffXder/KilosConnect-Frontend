import React from 'react';
import type { StatCardProps } from './IncidentReporting';

const StatCard: React.FC<StatCardProps> = ({ label, count, icon, colorClass }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px] flex-1">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800 leading-tight">{count}</div>
        <div className="text-gray-500 text-sm font-medium">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;