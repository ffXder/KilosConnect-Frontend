import {
  AlertTriangle,
  Database,
  FileText,
  Wrench,
} from "lucide-react";
import type { LogItem } from "./LogsMain";

interface Props {
  logs: LogItem[];
}

export default function LogsHeaderSection({ logs }: Props) {
  // Compute totals from data
  const totalEvents = logs.length;
  const totalIncidents = logs.filter(l => l.type === 'Incident').length;
  const totalMaintenance = logs.filter(l => l.type === 'Maintenance').length;
  const totalAssets = logs.filter(l => l.type === 'Asset').length;

  const cards = [
    {
      label: "Total Events",
      value: totalEvents,
      icon: Database,
      color: "text-green-500",
    },
    {
      label: "Incidents",
      value: totalIncidents,
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      label: "Maintenance",
      value: totalMaintenance,
      icon: Wrench,
      color: "text-orange-500",
    },
    {
      label: "Assets",
      value: totalAssets,
      icon: FileText,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[24px] font-bold text-[#1E293B]">
          Activity Logs
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Immutable audit trail of all system activities
        </p>
      </div>

      <div className="flex gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                border
                border-[#E5E7EB]
                rounded-xl
                shadow-sm
                px-4
                py-3
                flex
                items-center
                gap-3
              "
            >
              <Icon
                size={24}
                className={card.color}
              />

              <div>
                <span className="font-semibold text-sm block">
                  {card.value}
                </span>
                <span className="text-[10px] text-gray-400">
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

