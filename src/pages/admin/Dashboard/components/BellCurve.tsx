import { Activity } from 'lucide-react';
import { useRef, useState } from 'react';

export interface ZoneActivity {
  zone: string;
  open: number;
  inProgress: number;
  resolved: number;
}

const series = [
  { key: 'open', label: 'Open', color: '#f97316' },
  { key: 'inProgress', label: 'In Progress', color: '#185FA5' },
  { key: 'resolved', label: 'Resolved', color: '#22c55e' },
] as const;

const standardZones = [
  'Mezzanine',
  'Powerlifting Area',
  'Open WOD Area',
  'Weightlifting Area',
  'CrossFit Area',
  'Café',
  'General Storage',
  'Maintenance Storage',
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

function wrapZoneLabel(label: string, maxChars: number): string[] {
  if (label === 'Open WOD Area') return ['Open WOD', 'Area'];

  const words = label.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

interface DashboardBellCurveProps {
  data?: ZoneActivity[];
  title?: string;
  subtitle?: string;
}

const DashboardBellCurve: React.FC<DashboardBellCurveProps> = ({
  data = [],
  title = "Activity by Zone",
  subtitle = 'Incident activity by zone',
}) => {
  const normalizeZone = (zone: string) =>
    zone
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+area$/, "");
  const canonicalizeZone = (zone: string) => {
    const normalized = normalizeZone(zone).replace(/\s+/g, ' ');
    if (normalized === 'powerlifting') return 'Powerlifting Area';
    if (['weight lift', 'weight lifting', 'weightlifting'].includes(normalized)) {
      return 'Weightlifting Area';
    }
    if (normalized === 'open wod') return 'Open WOD Area';
    if (normalized === 'crossfit') return 'CrossFit Area';
    if (normalized === 'cafe') return 'Café';
    return standardZones.find((item) => normalizeZone(item) === normalized) ?? zone.trim();
  };
  const zonesByName = new Map<string, ZoneActivity>(
    standardZones.map((zone) => [
      normalizeZone(zone),
      { zone, open: 0, inProgress: 0, resolved: 0 },
    ]),
  );
  for (const entry of data) {
    const zone = canonicalizeZone(entry.zone);
    const key = normalizeZone(zone);
    const existing = zonesByName.get(key);
    if (existing) {
      existing.open += entry.open;
      existing.inProgress += entry.inProgress;
      existing.resolved += entry.resolved;
    } else {
      zonesByName.set(key, { ...entry, zone });
    }
  }
  const chartData = Array.from(zonesByName.values());
  const cafeIndex = chartData.findIndex((item) => normalizeZone(item.zone) === "cafe");
  const maintenanceIndex = chartData.findIndex((item) => {
    const zone = normalizeZone(item.zone);
    return zone === "maintenance" || zone === "maintenance storage";
  });

  if (cafeIndex >= 0 && maintenanceIndex >= 0) {
    [chartData[cafeIndex], chartData[maintenanceIndex]] = [
      chartData[maintenanceIndex],
      chartData[cafeIndex],
    ];
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    points: { label: (typeof series)[number]['label']; value: number; color: string }[];
    x: number;
    y: number;
    zone: string;
  } | null>(null);

  const maxVal = Math.max(...chartData.flatMap((d) => [d.open, d.inProgress, d.resolved]), 1);
  const yMax = Math.max(10, Math.ceil(maxVal / 5) * 5);

  const svgW = 600;
  const svgH = 268;
  const pad = { top: 20, right: 20, bottom: 38, left: 40 };
  const chartW = svgW - pad.left - pad.right;
  const chartH = svgH - pad.top - pad.bottom;
  const maxLabelChars = Math.max(6, Math.floor((chartW / Math.max(chartData.length - 1, 1)) / 5.5));
  const wrappedZoneLabels = chartData.map((d) => wrapZoneLabel(d.zone, maxLabelChars));

  const toX = (i: number) =>
    chartData.length === 1
      ? pad.left + chartW / 2
      : pad.left + (i / (chartData.length - 1)) * chartW;
  const toY = (v: number) => svgH - pad.bottom - (v / yMax) * chartH;

  const zoneXPositions = chartData.map((_, i) => toX(i));

  const dataSeriesPts = Object.fromEntries(
    series.map(({ key }) => [
      key,
      chartData.map((entry, i) => ({ x: zoneXPositions[i], y: toY(entry[key]) })),
    ]),
  ) as Record<(typeof series)[number]['key'], { x: number; y: number }[]>;

  const yLabels = Array.from({ length: 6 }, (_, index) => (yMax / 5) * index);

  const handlePointHover = (
    event: React.MouseEvent<SVGCircleElement>,
    index: number,
    key: (typeof series)[number]['key'],
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const zone = chartData[index];
    if (!zone) return;
    const value = zone[key];
    const intersectingSeries = series.filter((item) => zone[item.key] === value);
    const displayedSeries = intersectingSeries.length > 1
      ? intersectingSeries
      : series.filter((item) => item.key === key);
    const points = displayedSeries.map((item) => ({
      label: item.label,
      value: zone[item.key],
      color: item.color,
    }));

    setHoveredPoint({
      points,
      zone: zone.zone,
      x: event.clientX - rect.left + 18,
      y: event.clientY - rect.top - 12,
    });
  };

  return (
    <div ref={containerRef} className="relative bg-[var(--bg-card)] border border-border rounded-2xl shadow-sm p-4 sm:p-6 dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border dark:border-slate-700">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
          <Activity size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[--var(--text)]">{title}</h3>
          <p className="text-xs text-[--var(--text)]">{subtitle}</p>
        </div>
      </div>

      {hoveredPoint && (
        <div
          className="pointer-events-none absolute z-20 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y,
            transform: 'translateZ(0)',
          }}
        >
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
            {hoveredPoint.zone}
          </div>
          {hoveredPoint.points.map((point) => (
            <div key={point.label}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: point.color }}>
                {point.label}
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: point.color }}>
                Reports: {point.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 w-full">
        <svg className="w-full" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet">
          {/* Horizontal grid lines with labels */}
          {yLabels.map((val) => {
            const y = toY(val);
            return (
              <g key={`h-${val}`}>
                <line x1={pad.left} y1={y} x2={svgW - pad.right} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                <text x={pad.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="text-[11px]" fill="var(--text)" fontWeight="600">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vertical dashed lines at zones */}
          {zoneXPositions.map((x) => (
            <line key={`v-${x}`} x1={x} y1={pad.top} x2={x} y2={svgH - pad.bottom} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          {data.length === 0 && (
            <text
              x={pad.left + chartW / 2}
              y={pad.top + chartH / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs"
              fill="var(--text)"
            >
              No incident activity yet
            </text>
          )}

          {series.map(({ key, color }) => (
            <g key={key}>
              <path
                d={smoothCurvePath([...dataSeriesPts[key]])}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {dataSeriesPts[key].map((point, index) => {
                const value = chartData[index]?.[key] ?? 0;
                const isIntersecting = series.filter(
                  (item) => chartData[index]?.[item.key] === value,
                ).length > 1;

                return (
                  <circle
                    key={`${key}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    fill={isIntersecting ? '#facc15' : color}
                    stroke="white"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-200 hover:r-6"
                    onMouseEnter={(event) => handlePointHover(event, index, key)}
                    onMouseMove={(event) => handlePointHover(event, index, key)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </g>
          ))}

          {/* Zone labels below chart */}
          {chartData.map((d, i) => (
            <text
              key={d.zone}
              x={zoneXPositions[i]}
              y={svgH - pad.bottom + 15}
              textAnchor="middle"
              className="text-[10px]"
              fill="var(--text)"
              fontWeight="600"
            >
              {wrappedZoneLabels[i].map((line, lineIndex) => (
                <tspan key={`${d.zone}-${lineIndex}`} x={zoneXPositions[i]} dy={lineIndex === 0 ? 0 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-0 pt-2 border-t border-gray-100">
        {series.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-[--var(--text)] font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardBellCurve;