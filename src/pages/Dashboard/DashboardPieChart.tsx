import { PieChart } from 'lucide-react';

export interface PieChartItem {
  label: string;
  color: string;        // tailwind bg class e.g. "bg-green-500"
  stroke: string;       // hex color e.g. "#22c55e"
  value: string;        // display percent e.g. "65%"
  count: number;
  dashArray: string;    // e.g. "65 35"
  dashOffset: string;   // e.g. "0"
}

const defaultPieData: PieChartItem[] = [
  { label: "Working", color: "bg-green-500", stroke: "#22c55e", value: "65%", count: 101, dashArray: "65 35", dashOffset: "0" },
  { label: "Under Repair", color: "bg-orange-400", stroke: "#fb923c", value: "15%", count: 23, dashArray: "15 85", dashOffset: "-65" },
  { label: "Damaged", color: "bg-red-500", stroke: "#ef4444", value: "12%", count: 19, dashArray: "12 88", dashOffset: "-80" },
  { label: "Decommissioned", color: "bg-gray-400", stroke: "#9ca3af", value: "8%", count: 13, dashArray: "8 92", dashOffset: "-92" },
];

interface DashboardPieChartProps {
  data?: PieChartItem[];
  total?: number;
  title?: string;
  subtitle?: string;
}

const DashboardPieChart: React.FC<DashboardPieChartProps> = ({
  data = defaultPieData,
  total = 156,
  title = "Asset Status Distribution",
  subtitle = "Current condition breakdown of all assets",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
          <PieChart size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 w-full max-w-md md:max-w-none">
          {/* Donut Chart SVG */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {data.map((item) => (
                <circle
                  key={item.label}
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke={item.stroke}
                  strokeWidth="3.2"
                  strokeDasharray={item.dashArray}
                  strokeDashoffset={item.dashOffset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{total}</div>
                <div className="text-[10px] text-gray-400 font-medium">Total</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 sm:space-y-4 w-full max-w-[200px]">
            {data.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-sm shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-gray-700">{item.label}</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400">{item.count} assets</div>
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-600 shrink-0">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPieChart;

