import React from 'react';
import type { StatCardProps } from './IncidentReporting';

const StatCard: React.FC<StatCardProps> = ({ label, count, icon, colorClass }) => {
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 flex-1">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center ${colorClass} shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{count}</div>
        <div className="text-gray-500 text-xs sm:text-sm font-medium">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;