import { TrendingUp } from 'lucide-react';

export interface BarChartItem {
  month: string;
  completed: number;
  pending: number;
}

const defaultBarData: BarChartItem[] = [
  { month: "Mar", completed: 62, pending: 38 },
  { month: "Apr", completed: 74, pending: 26 },
  { month: "May", completed: 58, pending: 42 },
  { month: "Jun", completed: 71, pending: 29 },
  { month: "Jul", completed: 85, pending: 15 },
];

interface DashboardBarChartProps {
  data?: BarChartItem[];
  title?: string;
  subtitle?: string;
}

const DashboardBarChart: React.FC<DashboardBarChartProps> = ({
  data = defaultBarData,
  title = "Maintenance Trends",
  subtitle = "Completed vs Pending over the last 4 months",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
          <TrendingUp size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex mt-8 h-56">
        {/* Y-axis labels + grid lines */}
        <div className="relative w-8 shrink-0 pb-7">
          {[100, 80, 60, 40, 20, 0].map((val) => (
            <span
              key={val}
              className="absolute right-2 text-[10px] font-semibold text-gray-400 translate-y-[3px]"
              style={{ bottom: `${val}%` }}
            >
              {val}%
            </span>
          ))}
        </div>

        {/* Bars area with horizontal grid lines */}
        <div className="flex-1 relative pb-7">
          {/* Horizontal grid lines */}
          {[100, 80, 60, 40, 20, 0].map((val) => (
            <div
              key={val}
              className="absolute left-0 right-0 border-t border-dashed border-gray-200"
              style={{ bottom: `${val}%` }}
            />
          ))}

          {/* Bars */}
          <div className="absolute inset-x-0 top-0 flex items-end justify-around" style={{ bottom: '-18px' }}>
            {data.map((item, idx) => {
              const completedHeight = item.completed;
              const pendingHeight = item.pending;

              return (
                <div key={item.month} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div className="flex items-end gap-[3px] h-full" style={{ height: '100%' }}>
                    {/* Completed bar (green) */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="text-[8px] font-semibold text-gray-400 mb-[2px]">
                        {item.completed}%
                      </div>
                      <div
                        className="w-[15px] rounded-[3px] bg-emerald-500 transition-all"
                        style={{ height: `${completedHeight}%` }}
                      />
                    </div>
                    {/* Pending bar (orange) */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="text-[8px] font-semibold text-gray-400 mb-[2px]">
                        {item.pending}%
                      </div>
                      <div
                        className="w-[15px] rounded-[3px] bg-orange-400 transition-all"
                        style={{ height: `${pendingHeight}%` }}
                      />
                    </div>
                  </div>
                  <div className={`text-[11px] font-semibold ${idx === data.length - 1 ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-gray-500 font-medium">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-400" />
          <span className="text-xs text-gray-500 font-medium">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBarChart;

