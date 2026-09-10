import { PieChart as PieChartIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface PieChartItem {
  name: string;
  value: number;
  color: string;
}

const defaultPieData: PieChartItem[] = [
  { name: 'Working', value: 65, color: '#22c55e' },
  { name: 'Damaged', value: 18, color: '#f97316' },
  { name: 'Under Repair', value: 10, color: '#3b82f6' },
  { name: 'Hazardous', value: 5, color: '#ef4444' },
  { name: 'Decommissioned', value: 2, color: '#9ca3af' },
];

const fixedLegendItems: Array<{ name: string; color: string }> = [
  { name: 'Working', color: '#22c55e' },
  { name: 'Under Repair', color: '#3b82f6' },
  { name: 'Needs Repair', color: '#ffffff' },
  { name: 'Damaged', color: '#f97316' },
  { name: 'Hazardous', color: '#ef4444' },
  { name: 'Decommissioned', color: '#9ca3af' },
];

const tooltipTextByStatus: Record<string, string> = {
  Working: 'Working Assets',
  Damaged: 'Damaged Assets',
  'Under Repair': 'Under Repair Assets',
  Hazardous: 'Hazardous Assets',
  Decommissioned: 'Decommissioned Assets',
};

const StatusTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;
  const statusName = item?.name ?? 'Asset';
  const statusColor = item?.color ?? '#64748b';
  const assetCount = item?.value ?? 0;
  const textColor = statusName === 'Needs Repair' ? '#111827' : statusColor;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: textColor }}>
        {statusName}
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: textColor }}>
        Assets: {assetCount}
      </div>
    </div>
  );
};

interface DashboardPieChartProps {
  data?: PieChartItem[];
  total?: number;
  title?: string;
  subtitle?: string;
}

const DashboardPieChart: React.FC<DashboardPieChartProps> = ({
  data = defaultPieData,
  total = 100,
  title = 'Asset Status Distribution',
  subtitle = 'Current condition breakdown of all assets',
}) => {
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col dark:bg-slate-950 transition-colors duration-300 dark:border-slate-600">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
          <PieChartIcon size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-50">{title}</h3>
          <p className="text-xs text-gray-400 dark:text-slate-300">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 py-4">
        <div className="relative h-[200px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  content={<StatusTooltip />}
                  offset={18}
                  wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300 dark:text-slate-600">
                No data
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-slate-50">{total}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-400">Total</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-2">
          {fixedLegendItems.map((item) => {
            const matchingItem = chartData.find((entry) => entry.name === item.name);
            const currentValue = matchingItem?.value ?? 0;

            return (
              <div key={item.name} className="flex items-center gap-2 min-w-0">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-gray-700 dark:text-slate-200 truncate">{item.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-400">{currentValue}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPieChart;