import { Activity } from 'lucide-react';

export interface ZoneActivity {
  zone: string;
  incidents: number;
  maintenance: number;
}

const defaultZones: ZoneActivity[] = [
  { zone: "Mezzanine", incidents: 2, maintenance: 3 },
  { zone: "Powerlifting", incidents: 4, maintenance: 6 },
  { zone: "WOD Area", incidents: 8, maintenance: 10 },
  { zone: "Weight Lift", incidents: 5, maintenance: 7 },
  { zone: "CrossFit", incidents: 3, maintenance: 5 },
];

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const cp1x = a.x + (b.x - a.x) * 0.35;
    const cp1y = a.y;
    const cp2x = a.x + (b.x - a.x) * 0.65;
    const cp2y = b.y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${b.x},${b.y}`;
  }
  return d;
}

interface DashboardBellCurveProps {
  data?: ZoneActivity[];
  title?: string;
  subtitle?: string;
}

const DashboardBellCurve: React.FC<DashboardBellCurveProps> = ({
  data = defaultZones,
  title = "Activity by Zone",
  subtitle = "Incidents vs Maintenance per area",
}) => {
  const maxVal = Math.max(...data.flatMap((d) => [d.incidents, d.maintenance]), 1);
  const yMax = Math.ceil(maxVal / 2) * 2;

  // viewBox: 0 0 500 200
  const viewBoxW = 500;
  const viewBoxH = 200;
  const padding = 10;
  const chartW = viewBoxW - padding * 2;
  const chartH = viewBoxH - padding * 2;

  // Zone x-positions evenly spread
  const zoneXPositions = data.map((_, i) => {
    if (data.length <= 1) return viewBoxW / 2;
    return padding + (i / (data.length - 1)) * chartW;
  });

  const toY = (v: number) => viewBoxH - padding - (v / yMax) * chartH;

  // Build points with edge padding for smooth curves
  const edgePadY = viewBoxH - padding;

  const incPts = [
    { x: 0, y: edgePadY },
    ...data.map((d, i) => ({ x: zoneXPositions[i], y: toY(d.incidents) })),
    { x: viewBoxW, y: edgePadY - 5 },
  ];

  const mntPts = [
    { x: 0, y: edgePadY - 3 },
    ...data.map((d, i) => ({ x: zoneXPositions[i], y: toY(d.maintenance) })),
    { x: viewBoxW, y: edgePadY - 8 },
  ];

  const incidentPath = smoothPath(incPts);
  const maintenancePath = smoothPath(mntPts);

  // Y-axis labels
  const yLabels: number[] = [];
  const step = Math.max(1, Math.round(yMax / 5));
  for (let v = 0; v <= yMax; v += step) yLabels.push(v);
  if (yLabels[yLabels.length - 1] !== yMax) yLabels.push(yMax);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
          <Activity size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex mt-8 h-64">
        {/* Y-axis labels */}
        <div className="relative w-8 shrink-0 pb-8">
          {yLabels.map((val) => (
            <span
              key={val}
              className="absolute right-2 text-[10px] font-semibold text-gray-400"
              style={{ bottom: `${(val / yMax) * 100}%`, transform: 'translateY(50%)' }}
            >
              {val}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative pb-8">
          {/* Horizontal grid lines */}
          {yLabels.map((val) => (
            <div
              key={val}
              className="absolute left-0 right-0 border-t border-dashed border-gray-200"
              style={{ bottom: `${(val / yMax) * 100}%` }}
            />
          ))}

          {/* SVG */}
          <svg
            className="absolute inset-x-0 top-0 w-full h-full"
            viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Vertical dashed lines at zones */}
            {zoneXPositions.map((x) => (
              <line key={x} x1={x} y1={0} x2={x} y2={viewBoxH - padding} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Red curve - Incidents */}
            <path d={incidentPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Green curve - Maintenance */}
            <path d={maintenancePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots on red line */}
            {incPts.map((p, i) => (
              <circle key={`i-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#ef4444" stroke="white" strokeWidth="1" />
            ))}
            {/* Dots on green line */}
            {mntPts.map((p, i) => (
              <circle key={`m-${i}`} cx={p.x} cy={p.y} r="2.5" fill="#22c55e" stroke="white" strokeWidth="1" />
            ))}
          </svg>

          {/* Zone labels */}
          <div className="absolute inset-x-0 bottom-0 flex justify-around" style={{ bottom: '-18px' }}>
            {data.map((d, i) => (
              <div key={d.zone} className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">{d.zone}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-xs text-gray-500 font-medium">Incidents</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span className="text-xs text-gray-500 font-medium">Maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBellCurve;

