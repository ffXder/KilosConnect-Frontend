interface LogsStatsSectionProps {
  stats?: Record<string, number>; // e.g. { Asset: 12, TaskLog: 5, IncidentReport: 3 }
  isLoading?: boolean;
}

export default function LogsStatsSection({ stats = {}, isLoading = false }: LogsStatsSectionProps) {
  const categories = [
    { 
      label: "Asset Registry", 
      count: stats["Asset"] || 0 
    },
    { 
      label: "Task", 
      count: stats["Task"] || 0 
    },
    { 
      label: "Incident", 
      count: (stats["IncidentReport"] || 0) + (stats["Incident Report"] || 0) + (stats["Incident"] || 0) 
    },
    { 
      label: "Task Log", 
      count: stats["TaskLog"] || 0 
    },
    { 
      label: "Lost & Found", 
      count: (stats["LostAndFound"] || 0) + (stats["Lost And Found"] || 0) + (stats["Lost & Found"] || 0) 
    },
    { 
      label: "Repair Log", 
      count: stats["RepairLog"] || 0 
    },
    { 
      label: "User", 
      count: stats["User"] || 0 
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
      {categories.map((item) => (
        <div
          key={item.label}
          className="
            bg-white
            border
            border-[#E5E7EB]
            rounded-xl
            shadow-sm
            p-3.5
            sm:p-4
            flex
            flex-col
            justify-between
            transition-shadow
            hover:shadow-md
          "
        >
          <p className="text-[11px] font-medium tracking-wide uppercase text-[#64748B] truncate">
            {item.label}
          </p>

          <p className="mt-1 text-2xl sm:text-[28px] font-bold text-[#0f2942]">
            {isLoading ? "..." : item.count.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}