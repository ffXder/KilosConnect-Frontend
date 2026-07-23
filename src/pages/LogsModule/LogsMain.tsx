import React, { useMemo, useState } from "react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../contexts/SidebarContext";

import LogsHeaderSection from "./LogsHeaderSection";
import LogsFilterSection from "./LogsFilterSection";
import LogsStatsSection from "./LogsStatsSection";
import LogsTableSection from "./LogsTableSection";

export interface LogItem {
  timestamp: string;
  user: string;
  type: string;
  action: string;
  details: string;
}

export default function LogsMain() {
  const { role } = useAuth();
  const { isExpanded } = useSidebar();
  const sidebarMargin = isExpanded ? "lg:ml-[240px]" : "ml-[78px]";

  const userRole =
    (role ?? "custodian") as React.ComponentProps<
      typeof SidebarNavigationSection
    >["userRole"];

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  const logs: LogItem[] = [
    {
      timestamp: "2024-05-17 14:32:15",
      user: "Sarah Admin",
      type: "Asset",
      action: "Asset Created",
      details:
        "Created new asset: Olympic Barbell #46 in Powerlifting Area",
    },
    {
      timestamp: "2024-05-17 14:15:42",
      user: "John Custodian",
      type: "Maintenance",
      action: "Maintenance Completed",
      details:
        "Completed maintenance verification for Mezzanine zone with photo evidence",
    },
    {
      timestamp: "2024-05-17 13:48:21",
      user: "Maria Staff",
      type: "Incident",
      action: "Incident Reported",
      details:
        "Reported new incident: Cable fraying on Cable Machine B (INC-002)",
    },
    {
      timestamp: "2024-05-17 12:22:33",
      user: "John Custodian",
      type: "Lost & Found",
      action: "Item Added",
      details:
        "Added lost item: Black Water Bottle found in Mezzanine",
    },
    {
      timestamp: "2024-05-17 11:05:18",
      user: "Sarah Admin",
      type: "User",
      action: "User Created",
      details:
        "Created new custodian account: Mike Rodriguez",
    },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.type.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType === "All" ||
        log.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [logs, search, selectedType]);

  return (
    <div className="flex min-h-screen w-full bg-[#F5F7FB]">
      <SidebarNavigationSection userRole={userRole} />

      <main className={`flex-1 w-full ${sidebarMargin} p-3 sm:p-5 lg:p-8 transition-all duration-300 overflow-x-hidden`}>
        <div className="space-y-3 sm:space-y-4">
          <LogsHeaderSection logs={logs} />

          <LogsFilterSection
            search={search}
            setSearch={setSearch}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <LogsStatsSection logs={logs} />

          <LogsTableSection logs={filteredLogs} isLoading={false} />
        </div>
      </main>
    </div>
  );
}

