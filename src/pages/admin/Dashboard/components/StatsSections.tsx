import { Box, AlertTriangle, Wrench, Activity } from 'lucide-react';

export interface StatCardData {
  label: string;
  count: string | number;
  sublabel: string;
  colorClass: string;
}

const defaultStats: StatCardData[] = [
  {
    label: "Total Assets",
    count: 2,
    sublabel: "+1 added this month",
    colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-200",
  },
  {
    label: "Active Incidents",
    count: 3,
    sublabel: "2 urgent",
    colorClass: "bg-red-100 text-red-600 dark:bg-red-200",
  },
  {
    label: "Maintenance Tasks",
    count: 2,
    sublabel: "1 overdue",
    colorClass: "bg-orange-100 text-orange-600 dark:bg-orange-200",
  },
  {
    label: "Working Equipment",
    count: "94%",
    sublabel: "+5% this week",
    colorClass: "bg-green-100 text-green-600 dark:bg-green-200",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  "Total Assets": <Box size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />,
  "Active Incidents": <AlertTriangle size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />,
  "Maintenance Tasks": <Wrench size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />,
  "Working Equipment": <Activity size={16} strokeWidth={2} className="sm:size-[20px] md:size-[24px] lg:size-[28px]" />,
};

interface DashboardStatsSectionProps {
  stats?: StatCardData[];
}

const DashboardStatsSection: React.FC<DashboardStatsSectionProps> = ({ stats = defaultStats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 lg:gap-5 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-2 sm:p-3 md:p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 dark:bg-slate-950 transition-colors duration-300 dark: border-slate-600"
        >
          <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${stat.colorClass}`}>
            {iconMap[stat.label] || <Box size={14} strokeWidth={2} className="sm:size-[16px] md:size-[20px] lg:size-[24px]" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-tight dark:text-slate-50 font-bold">{stat.count}</div>
            <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium truncate  dark:text-slate-400">{stat.label}</div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 mt-0.5 truncate dark:text-slate-400">{stat.sublabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsSection;