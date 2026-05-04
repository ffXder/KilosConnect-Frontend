import React, { useState, useEffect } from 'react';
import type { StatData } from './LogsStatsSection'; 
import LogsFilterSection from './LogsFilterSection';
import LogsListSection from './LogsListSection';
import type { LogEntry } from './LogsListSection'; 
import LogsStatsSection from './LogsStatsSection';
import {
  InventoryIcon,
  TaskIcon,
  IncidentIcon,
  LostFoundIcon,
} from './LogsIcons';
import { useAuth } from '../../Hooks/useAuth';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';

const moduleToFilterType = (moduleName: string) => {
  switch (moduleName) {
    case 'Inventory':
    case 'Asset':
      return 'Inventory';
    case 'Task':
      return 'Tasks';
    case 'IncidentReport':
      return 'Incidents';
    case 'LostAndFound':
      return 'Lost & Found';
    default:
      return 'All Logs';
  }
};

const moduleToEntryIcon = (moduleName: string) => {
  switch (moduleName) {
    case 'Inventory': return <InventoryIcon />;
    case 'Task': return <TaskIcon />;
    case 'IncidentReport': return <IncidentIcon />;
    case 'LostAndFound': return <LostFoundIcon />;
    default: return <InventoryIcon />;
  }
};

const moduleToEntryBg = (moduleName: string) => {
  switch (moduleName) {
    case 'Inventory': return 'bg-blue-50';
    case 'Task': return 'bg-[#e6f9f0]';
    case 'IncidentReport': return 'bg-red-50';
    case 'LostAndFound': return 'bg-purple-50';
    default: return 'bg-blue-50';
  }
};

// Mock data array to replace the getAuditLogs service call[cite: 5]
const mockRawLogs = [
  { _id: '1', module: 'Task', action: 'Task Completed', details: 'Morning equipment sanitation completed', performedBy: 'John Doe', createdAt: '2026-05-03T08:00:00Z' },
  { _id: '2', module: 'Inventory', action: 'Stock Updated', details: 'Added 50 units of Floor Cleaner', performedBy: 'Bingbong Marcos', createdAt: '2026-05-03T09:30:00Z' },
  { _id: '3', module: 'IncidentReport', action: 'Incident Reported', details: 'Loose cable found on treadmill #4', performedBy: 'Daniel Tan', createdAt: '2026-05-03T10:15:00Z' },
  { _id: '4', module: 'LostAndFound', action: 'Item Logged', details: 'Black Hydroflask bottle found in locker area', performedBy: 'John Doe', createdAt: '2026-05-03T11:00:00Z' },
  { _id: '5', module: 'Task', action: 'Task Assigned', details: 'Weekly fire safety inspection', performedBy: 'Admin', createdAt: '2026-05-03T13:45:00Z' },
  { _id: '6', module: 'LostAndFound', action: 'Item Claimed', details: 'Black Hydroflask claimed by Sarah Lee', performedBy: 'Cads', createdAt: '2026-05-03T14:30:00Z' }
];

const Logs: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All Logs');
  const [stats, setStats] = useState<StatData[]>([
    { label: 'Inventory Logs', count: 0, icon: <InventoryIcon />, bg: 'bg-blue-50', color: ''},
    { label: 'Task Logs', count: 0, icon: <TaskIcon />, bg: 'bg-[#e6f9f0]', color: '' },
    { label: 'Incident Logs', count: 0, icon: <IncidentIcon />, bg: 'bg-red-50', color: '' },
    { label: 'Lost & Found Logs', count: 0, icon: <LostFoundIcon />, bg: 'bg-purple-50', color: '' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulated fetch using mock data[cite: 5]
    const formattedLogs = mockRawLogs.map((log: any) => ({
      ...log,
      id: log._id,
      type: moduleToFilterType(log.module),
      title: log.action,
      description: log.details || '',
      user: log.performedBy,
      timestamp: new Date(log.createdAt).toLocaleString(),
      icon: moduleToEntryIcon(log.module),
      bg: moduleToEntryBg(log.module),
    })).reverse(); 

    setLogs(formattedLogs);
    updateStats(mockRawLogs); 
    setLoading(false);
  }, []);

  const updateStats = (loadedLogs: any[]) => {
    const counts = loadedLogs.reduce<Record<string, number>>((acc, log) => {
      const moduleName = log.module; 
      acc[moduleName] = (acc[moduleName] ?? 0) + 1;
      return acc;
    }, {});

    setStats([
      { label: 'Inventory Logs', count: counts.Inventory ?? 0, icon: <InventoryIcon />, bg: 'bg-blue-50', color: '' },
      { label: 'Task Logs', count: counts.Task ?? 0, icon: <TaskIcon />, bg: 'bg-[#e6f9f0]', color: '' },
      { label: 'Incident Logs', count: counts.IncidentReport ?? 0, icon: <IncidentIcon />, bg: 'bg-red-50', color: '' },
      { label: 'Lost & Found Logs', count: counts.LostAndFound ?? 0, icon: <LostFoundIcon />, bg: 'bg-purple-50', color: '' },
    ]);
  };

  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      <div className="w-64 shrink-0">
        <SidebarNavigationSection userRole={userRole}/>
      </div>
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-8 w-full">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Activity Logs</h1>
            <p className="text-gray-500 text-sm mt-1">View all system activities and changes</p>
          </div>
        </header>
        <LogsStatsSection stats={stats} />
        <div className="mt-8 mb-6">
          <LogsFilterSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading activities...</div>
        ) : (
          <div className="space-y-4"> 
            <LogsListSection logs={logs} activeFilter={activeFilter} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Logs;