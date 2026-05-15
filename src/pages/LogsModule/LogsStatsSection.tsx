import React, { type ReactNode } from 'react';

export interface StatData {
  label: string;
  count: number;
  icon: ReactNode;
  color: string;
  bg: string;
}

interface Props {
  stats: StatData[];
}

export const LogsStatsSection: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-4 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-sm min-w-50">
          <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{stat.count}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider whitespace-nowrap">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};