import type { LogItem } from "./LogsMain";

interface Props {
  logs: LogItem[];
}

export default function LogsStatsSection({ logs }: Props) {
  // Count logs by type
  const assetCount = logs.filter(l => l.type === 'Asset').length;
  const incidentCount = logs.filter(l => l.type === 'Incident').length;
  const maintenanceCount = logs.filter(l => l.type === 'Maintenance').length;
  const lostFoundCount = logs.filter(l => l.type === 'Lost & Found').length;
  const userCount = logs.filter(l => l.type === 'User').length;
  const systemCount = logs.filter(l => !['Asset', 'Incident', 'Maintenance', 'Lost & Found', 'User'].includes(l.type)).length;

  const stats = [
    { label: "Asset", value: assetCount },
    { label: "Incident", value: incidentCount },
    { label: "Maintenance", value: maintenanceCount },
    { label: "Lost & Found", value: lostFoundCount },
    { label: "User", value: userCount },
    { label: "System", value: systemCount },
  ];

  return (
    <div className="grid grid-cols-6 gap-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="
            bg-white
            border
            border-[#E5E7EB]
            rounded-xl
            shadow-sm
            p-4
          "
        >
          <p className="text-[11px] text-[#64748B]">
            {item.label}
          </p>

          <p className="mt-1 text-[28px] font-semibold text-[#0F172A]">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

