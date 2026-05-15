import React, { useState, useEffect } from 'react';
import type { StatData } from './LogsStatsSection'; 
import { LogsFilterSection }from './LogsFilterSection';
import { LogsListSection } from './LogsListSection';
import type { LogEntry } from './LogsListSection'; 
import { LogsStatsSection } from './LogsStatsSection';
import {
  InventoryIcon,
  TaskIcon,
  IncidentIcon,
  LostFoundIcon,
} from './LogsIcons';
import { useAuth } from '../../hooks/useAuth';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import { useAuditLogs } from '../../hooks/useLogs';
import type { AuditLogs } from '../../types/auditLogs';
import { getDateThreshold } from '../../utils/dateHelper';

const moduleToFilterType = (moduleName: string) => {
  switch (moduleName) {
    case 'Inventory':
    case 'Asset':    
    case 'Consumable': 
      return 'Inventory';
    case 'Task':
      return 'Tasks';
    case 'Incident Report':
      return 'Incidents';
    case 'Lost And Found':
      return 'Lost & Found';
    default:
      return 'All Logs';
  }
};

const actionToFriendlyLabel = (action: string) => {
  // Convert Schema ENUMs (CREATE, UPDATE) to readable text
  switch (action) {
    case 'CREATE': return 'Created';
    case 'UPDATE': return 'Updated';
    case 'ARCHIVE': return 'Archived';
    case 'DELETE': return 'Deleted';
    case 'COMPLETE': return 'Completed';
    case 'CLAIM': return 'Claimed';
    default: return action; // Fallback to raw string
  }
};

const moduleToEntryIcon = (moduleName: string) => {
  switch (moduleName) {
    case 'Inventory':
    case 'Asset':
    case 'Consumable': 
      return <InventoryIcon />;
    case 'Task': 
      return <TaskIcon />;
    case 'Incident Report': 
      return <IncidentIcon />;
    case 'Lost And Found': 
      return <LostFoundIcon />;
    default: 
      return <InventoryIcon />; // Default fallback
  }
};

const moduleToEntryBg = (moduleName: string) => {
  switch (moduleName) {
    case 'Inventory': return 'bg-blue-50';
    case 'Task': return 'bg-[#e6f9f0]';
    case 'Incident Report': return 'bg-red-50';
    case 'Lost And Found': return 'bg-purple-50';
    default: return 'bg-blue-50';
  }
};


export const LogsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All Logs');
  const [dateRange, setDateRange] = useState('Last 7 Days'); // for dates
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const { logs: rawLogs, isLoading, error } = useAuditLogs();
  const [stats, setStats] = useState<StatData[]>([
    { label: 'Inventory Logs', count: 0, icon: <InventoryIcon />, bg: 'bg-blue-50', color: ''},
    { label: 'Task Logs', count: 0, icon: <TaskIcon />, bg: 'bg-[#e6f9f0]', color: '' },
    { label: 'Incident Logs', count: 0, icon: <IncidentIcon />, bg: 'bg-red-50', color: '' },
    { label: 'Lost & Found Logs', count: 0, icon: <LostFoundIcon />, bg: 'bg-purple-50', color: '' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading && rawLogs) {
    const formattedLogs: LogEntry[] = rawLogs.map((log: any) => ({
        id: log._id,
        type: moduleToFilterType(log.module),
        title: `${actionToFriendlyLabel(log.action)} ${log.module}`,
        description: log.details || 'No additional details',
        user: log.performedBy || 'System',
        rawDate: log.createdAt, 
        timestamp: new Date(log.createdAt).toLocaleString('en-PH', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        icon: moduleToEntryIcon(log.module),
        bg: moduleToEntryBg(log.module),   
  }));

    setLogs(formattedLogs);

    // Calculate Stats
    const counts = (rawLogs as AuditLogs[]).reduce<Record<string, number>>((acc, log) => {
      acc[log.module] = (acc[log.module] ?? 0) + 1;
      return acc;
  }, {});

    setStats([
      { 
        label: 'Inventory Logs', 
        count: (counts.Inventory ?? 0) + (counts.Asset ?? 0) + (counts.Consumable ?? 0), 
        icon: <InventoryIcon />, 
        bg: 'bg-blue-50', 
        color: '' 
      },
      { label: 'Task Logs', count: counts.Task ?? 0, icon: <TaskIcon />, bg: 'bg-[#e6f9f0]', color: '' },
      { label: 'Incident Logs', count: counts.IncidentReport ?? 0, icon: <IncidentIcon />, bg: 'bg-red-50', color: '' },
      { label: 'Lost & Found Logs', count: counts.LostAndFound ?? 0, icon: <LostFoundIcon />, bg: 'bg-purple-50', color: '' },
    ]);

    setLoading(false); // Stop showing the loading spinner
  }
}, [rawLogs, isLoading]);

  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

// filter logs by date range
const isYesterday = dateRange === 'Yesterday';

const threshold = getDateThreshold(
  dateRange,
  customStart ? new Date(customStart) : null
);
const endDate = customEnd ? new Date(customEnd) : null;

const dateFilteredLogs = logs.filter(log => {
  const logDate = new Date(log.rawDate);

  const matchesStart = threshold ? logDate >= threshold : true;

  const matchesEnd = isYesterday
    ? logDate < new Date(new Date().setHours(0, 0, 0, 0))
    : endDate
      ? logDate <= new Date(new Date(customEnd).setHours(23, 59, 59, 999))
      : true;

  return matchesStart && matchesEnd;
});

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      <div className="w-64 shrink-0">
        <SidebarNavigationSection userRole={userRole}/>
      </div>
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-8 w-full">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Activity Logs</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">View all system activities and changes</p>
          </div>
        </header>
        <LogsStatsSection stats={stats} />
        <div className="mt-8 mb-6">
          <LogsFilterSection 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customStart={customStart}
            setCustomStart={setCustomStart}
            customEnd={customEnd}
            setCustomEnd={setCustomEnd}
          />
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading activities...</div>
        ) : (
          <div className="space-y-4"> 
            <LogsListSection 
              logs={dateFilteredLogs} 
              activeFilter={activeFilter}
              dateRange={dateRange}
              customStart={customStart}
              customEnd={customEnd}
            />
          </div>
        )}
      </main>
    </div>
  );
};
