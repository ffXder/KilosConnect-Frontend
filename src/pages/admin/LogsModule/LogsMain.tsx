import React, { useMemo } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { useAuditLogs } from "../../../hooks/useAuditLogs";
import { useUrlFilters } from "../../../hooks/useUrlFilters";

import LogsHeaderSection from "./components/LogsHeaderSection";
import LogsFilterSection from "./components/LogsFilterSection";
import LogsStatsSection from "./components/LogsStatsSection";
import LogsTableSection from "./components/LogsTableSection";


export function LogsPage() {
  const { role } = useAuth();
  const { getParam, updateParam, updateParams } = useUrlFilters();
  
  // read URL params
  const search = getParam("search", "");
  const selectedType = getParam("module", "All");
  const selectedDate = getParam("date", "All");
  const startDate = getParam("startDate", "");
  const endDate = getParam("endDate", "");
  const page = Number(getParam("page", "1"))

  // fetch data
  const { logs, stats, pagination, isLoading, error } = useAuditLogs({
    search,
    type: selectedType,
    date: selectedDate,
    startDate,
    endDate,
    page,
  });
  
  const handleSearchChange = (value: string) => {
    updateParams({
      search: { value, defaultValues: [""] },
      page: { value: "1", defaultValues: ["1"] },
    });
  };

  const handleFilterChange = (key: string, value: string, defaultValues: string[] = [""]) => {
  updateParams({
    [key]: { value, defaultValues },
    page: { value: "1", defaultValues: ["1"] },
  });
  };

  // URL params handler
  const setSearch = (value: string) => handleSearchChange(value);

  const setSelectedType = (value: string) => handleFilterChange("module", value, ["All Types", "All", ""]);

  const setSelectedDate = (value: string) => {
    if (value !== "Custom") {
      updateParams({
        date: { value, defaultValues: ["All Dates", "All"] },
        startDate: { value: "", defaultValues: [""] },
        endDate: { value: "", defaultValues: [""] },
        page: { value: "1", defaultValues: ["1"] },
      });
    } else {
      handleFilterChange("date", value, ["All Dates", "All"]);
    }
  };

  const setStartDate = (value: string) => handleFilterChange("startDate", value, [""]);
  const setEndDate = (value: string) => handleFilterChange("endDate", value, [""]);

  const onPageChange = (newPage: number) => {
    updateParam("page", String(newPage), ["1"]);
  };

  const userRole =
    (role ?? "custodian") as React.ComponentProps<
      typeof SidebarNavigationSection
    >["userRole"];

  return ( 
    <div className="flex min-h-screen bg-[#f4f5f6]">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 w-full overflow-y-auto pt-20 md:pt-0">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">
                Activity Logs
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Immutable audit trail of all system activities
              </p>
            </div>

            {/* temporary gone */}
            {/* <LogsHeaderSection /> */} 
          </div>

          <LogsFilterSection
            search={search}
            setSearch={setSearch}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startDate={startDate}
            setStartDate={setStartDate} 
            endDate={endDate}
            setEndDate={setEndDate}    
          />

          <LogsStatsSection stats={stats} isLoading={isLoading} />

          {isLoading ? (
            <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center text-sm text-gray-500 shadow-sm">
              Loading audit logs...
            </div>
          ) : error ? (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-2xl p-8 text-center text-sm">
              {error}
            </div>
          ) : (
            <LogsTableSection 
              logs={logs}
              pagination={pagination}
              onPageChange={onPageChange}
            />
          )}

        </div>
      </main>
    </div>
  );
}