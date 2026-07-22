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
    colorClass: "bg-blue-100 text-blue-600",
  },
  {
    label: "Active Incidents",
    count: 3,
    sublabel: "2 urgent",
    colorClass: "bg-red-100 text-red-600",
  },
  {
    label: "Maintenance Tasks",
    count: 2,
    sublabel: "1 overdue",
    colorClass: "bg-orange-100 text-orange-600",
  },
  {
    label: "Working Equipment",
    count: "94%",
    sublabel: "+5% this week",
    colorClass: "bg-green-100 text-green-600",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  "Total Assets": <Box size={28} strokeWidth={2} />,
  "Active Incidents": <AlertTriangle size={28} strokeWidth={2} />,
  "Maintenance Tasks": <Wrench size={28} strokeWidth={2} />,
  "Working Equipment": <Activity size={28} strokeWidth={2} />,
};

interface DashboardStatsSectionProps {
  stats?: StatCardData[];
}

const DashboardStatsSection: React.FC<DashboardStatsSectionProps> = ({ stats = defaultStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5"
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.colorClass}`}>
            {iconMap[stat.label] || <Box size={28} strokeWidth={2} />}
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800 leading-tight">{stat.count}</div>
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsSection;

