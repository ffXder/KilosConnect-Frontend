import { Activity } from 'lucide-react';
import { useRef, useState } from 'react';

export interface ZoneActivity {
  zone: string;
  open: number;
  resolved: number;
}

const defaultZones: ZoneActivity[] = [
  { zone: 'Mezzanine', open: 2, resolved: 4 },
  { zone: 'Powerlifting', open: 5, resolved: 7 },
  { zone: 'WOD Area', open: 4, resolved: 10 },
  { zone: 'Weight Lift', open: 4, resolved: 6 },
  { zone: 'CrossFit', open: 1, resolved: 3 },
];

function smoothCurvePath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const tension = 0.12;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
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
  subtitle = 'Incident activity by zone',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    value: number;
    color: string;
    x: number;
    y: number;
    zone: string;
  } | null>(null);

  const maxVal = Math.max(...data.flatMap((d) => [d.open, d.resolved]), 1);
  const yMax = Math.ceil(maxVal / 2) * 2;
  const step = 2;

  const svgW = 600;
  const svgH = 280;
  const pad = { top: 20, right: 20, bottom: 50, left: 40 };
  const chartW = svgW - pad.left - pad.right;
  const chartH = svgH - pad.top - pad.bottom;

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => svgH - pad.bottom - (v / yMax) * chartH;

  const zoneXPositions = data.map((_, i) => toX(i));

  const dataOpenPts = data.map((d, i) => ({ x: zoneXPositions[i], y: toY(d.open) }));
  const dataResolvedPts = data.map((d, i) => ({ x: zoneXPositions[i], y: toY(d.resolved) }));

  const yLabels: number[] = [];
  for (let v = 0; v <= yMax; v += step) yLabels.push(v);

  const handlePointHover = (
    event: React.MouseEvent<SVGCircleElement>,
    label: 'Open' | 'Resolved',
    value: number,
    color: string,
    zone: string,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setHoveredPoint({
      label,
      value,
      color,
      zone,
      x: event.clientX - rect.left + 18,
      y: event.clientY - rect.top - 12,
    });
  };

  return (
    <div ref={containerRef} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 dark:dark:bg-slate-950 transition-colors duration-300 dark:border-slate-600">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
          <Activity size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-50 font-bold">{title}</h3>
          <p className="text-xs text-gray-400 dark:text-slate-300">{subtitle}</p>
        </div>
      </div>

      {hoveredPoint && (
        <div
          className="pointer-events-none absolute z-20 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y,
            transform: 'translateZ(0)',
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: hoveredPoint.color }}>
            {hoveredPoint.label}
          </div>
          <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: hoveredPoint.color }}>
            Reports: {hoveredPoint.value}
          </div>
        </div>
      )}

      <div className="mt-6 w-full">
        <svg className="w-full" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet" style={{ fontFamily: 'Poppins, Helvetica, sans-serif' }}>
          {/* Horizontal grid lines with labels */}
          {yLabels.map((val) => {
            const y = toY(val);
            return (
              <g key={`h-${val}`}>
                <line x1={pad.left} y1={y} x2={svgW - pad.right} y2={y} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 4" />
                <text x={pad.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="text-[10px]" fill="#9ca3af" fontWeight="600">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vertical dashed lines at zones */}
          {zoneXPositions.map((x) => (
            <line key={`v-${x}`} x1={x} y1={pad.top} x2={x} y2={svgH - pad.bottom} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          {/* Orange curve - Open */}
          <path d={smoothCurvePath([...dataOpenPts])} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Green curve - Resolved */}
          <path d={smoothCurvePath([...dataResolvedPts])} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots on orange line */}
          {dataOpenPts.map((p, i) => {
            const zone = data[i]?.zone ?? 'Unknown';
            const value = data[i]?.open ?? 0;

            return (
              <circle
                key={`open-${i}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#f97316"
                stroke="white"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-200 hover:r-6"
                onMouseEnter={(event) => handlePointHover(event, 'Open', value, '#f97316', zone)}
                onMouseMove={(event) => handlePointHover(event, 'Open', value, '#f97316', zone)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Dots on green line */}
          {dataResolvedPts.map((p, i) => {
            const zone = data[i]?.zone ?? 'Unknown';
            const value = data[i]?.resolved ?? 0;

            return (
              <circle
                key={`resolved-${i}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#22c55e"
                stroke="white"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-200 hover:r-6"
                onMouseEnter={(event) => handlePointHover(event, 'Resolved', value, '#22c55e', zone)}
                onMouseMove={(event) => handlePointHover(event, 'Resolved', value, '#22c55e', zone)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Zone labels below chart */}
          {data.map((d, i) => (
            <text
              key={d.zone}
              x={zoneXPositions[i]}
              y={svgH - pad.bottom + 20}
              textAnchor="middle"
              className="text-[10px]"
              fill="#6b7280"
              fontWeight="600"
            >
              {d.zone}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-500" />
          <span className="text-xs text-gray-500 font-medium dark:text-slate-300">Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span className="text-xs text-gray-500 font-medium dark:text-slate-300">Resolved</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBellCurve;