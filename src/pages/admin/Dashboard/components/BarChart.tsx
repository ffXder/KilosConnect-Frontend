import { TrendingUp } from 'lucide-react';

export interface BarChartItem {
  month: string;
  completed: number;
  pending: number;
}

const defaultBarData: BarChartItem[] = [
  { month: 'May', completed: 62, pending: 38 },
  { month: 'Jun', completed: 74, pending: 26 },
  { month: 'Jul', completed: 58, pending: 42 },
  { month: 'Aug', completed: 71, pending: 29 },
  { month: 'Sep', completed: 85, pending: 15 },
];

interface DashboardBarChartProps {
  data?: BarChartItem[];
  title?: string;
  subtitle?: string;
}

const DashboardBarChart: React.FC<DashboardBarChartProps> = ({
  data = defaultBarData,
  title = 'Maintenance Trends',
  subtitle = 'Completed vs Pending over the last 5 months',
}) => {
  const chartData = data.length > 0 ? data : [{ month: 'No Data', completed: 0, pending: 0 }];
  const svgW = 600;
  const svgH = 268;
  const pad = { top: 20, right: 20, bottom: 38, left: 40 };
  const chartW = svgW - pad.left - pad.right;
  const chartH = svgH - pad.top - pad.bottom;
  const yForValue = (value: number) => svgH - pad.bottom - (value / 100) * chartH;
  const gridValues = [100, 80, 60, 40, 20, 0];

  return (
    <div className="bg-[var(--bg-card)] border border-border rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
          <TrendingUp size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
          <p className="text-xs text-[--var(--text)]">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <svg className="w-full" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet">
          {gridValues.map((value) => {
            const y = yForValue(value);
            return (
              <g key={value}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={svgW - pad.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={pad.left - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-[11px]"
                  fill="var(--text)"
                  fontWeight="600"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {chartData.map((item, index) => {
            const groupWidth = chartW / chartData.length;
            const centerX = pad.left + groupWidth * (index + 0.5);
            const barWidth = Math.min(30, groupWidth * 0.28);
            const barGap = 3;
            const values = [
              { key: 'completed', value: item.completed, color: '#10b981' },
              { key: 'pending', value: item.pending, color: '#fb923c' },
            ];

            return (
              <g key={`${item.month}-${index}`}>
                {values.map(({ key, value, color }, seriesIndex) => {
                  const barHeight = (Math.max(0, Math.min(value, 100)) / 100) * chartH;
                  const x = centerX + (seriesIndex === 0 ? -barWidth - barGap / 2 : barGap / 2);
                  const y = svgH - pad.bottom - barHeight;
                  const labelY = Math.max(pad.top + 11, y - 6);

                  return (
                    <g key={key}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={color}
                      />
                      <text
                        x={x + barWidth / 2}
                        y={labelY}
                        textAnchor="middle"
                        className="text-[11px]"
                        fill="var(--text)"
                        fontWeight="600"
                      >
                        {value}%
                      </text>
                    </g>
                  );
                })}
                <text
                  x={centerX}
                  y={svgH - pad.bottom + 27}
                  textAnchor="middle"
                  className="text-xs"
                  fill="var(--text)"
                  fontWeight="600"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-0 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs font-semibold text-[--var(--text)]">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-400" />
          <span className="text-xs font-semibold text-[--var(--text)]">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBarChart;