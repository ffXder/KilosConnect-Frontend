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
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
      <div className="shrink-0">
        <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#1E293B]">
          Activity Logs
        </h1>

        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 sm:mt-1">
          Immutable audit trail of all system activities
        </p>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:gap-3 gap-2 w-full sm:w-auto">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                border
                border-[#E5E7EB]
                rounded-lg
                shadow-sm
                px-2 sm:px-3 lg:px-4
                py-1.5 sm:py-2 lg:py-3
                flex
                items-center
                gap-1.5 sm:gap-2
                min-w-0
              "
            >
              <Icon
                size={16}
                className={`${card.color} sm:size-[18px] lg:size-[24px] shrink-0`}
              />

              <div className="min-w-0">
                <span className="font-semibold text-[11px] sm:text-xs lg:text-sm block leading-tight">
                  {card.value}
                </span>
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-400 leading-tight">
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

