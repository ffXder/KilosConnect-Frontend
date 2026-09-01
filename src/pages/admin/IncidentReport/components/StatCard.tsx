import React from 'react';

interface StatsCardsProps {
  total: number;
  openCount: number;
  resolvedCount: number;
  highCount: number;
  lowCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  total,
  openCount,
  resolvedCount,
  highCount,
  lowCount,
}) => {
  const stats = [
    { label: 'Total', value: total, color: 'text-gray-700' },
    { label: 'Open', value: openCount, color: 'text-[#E67E22]' },
    { label: 'Resolved', value: resolvedCount, color: 'text-[#2ECC71]' },
    { label: 'High', value: highCount, color: 'text-[#E74C3C]' },
    { label: 'Low', value: lowCount, color: 'text-[#3498DB]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm"
        >
          <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;