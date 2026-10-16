import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

// COMPONENTS
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from './MonitorFilterSection';
import TaskListSection from './TaskListSection';
import ReviewSubmissionsTab from './ReviewSubmissionsTab';
import { TaskLogDetailModal } from './DetailsModal';

// HOOKS
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissons';
import { useTaskLogs } from '../../../hooks/useTaskLog';

// CONSTANTS
import { PERMISSIONS as P } from '../../../constants/permission';

interface TaskMonitorPageProps {
  view: 'monitor' | 'submissions';
}

export const TaskMonitorPage: React.FC<TaskMonitorPageProps> = ({ view }) => {
  const { logs, loading: isLoading, handleGenerate } = useTaskLogs();
  const { role } = useAuth();
  const { hasPermission } = usePermissions();

  const userRole = (role ?? 'custodian') as 'admin';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const isAdminOrSuperAdmin = userRole === 'admin' || userRole === 'super_admin';

  if (!hasPermission(P.TASK_READ)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Always read the latest version of the clicked log
  const selectedLog = logs.find(l => l._id === selectedId) ?? null;

  const handleGenerateClick = async () => {
    const result = await handleGenerate();
    if (result?.message) {
      setGenerateMessage(result.message);
      setTimeout(() => setGenerateMessage(null), 3000);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'All Tasks' ? true : log.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'All' ? true : log.task?.frequency === frequencyFilter;
    const matchesArea = areaFilter === 'All Areas' ? true : log.task?.area === areaFilter;
    const matchesSearch = log.task?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesFrequency && matchesArea && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 min-w-0 overflow-y-auto dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2942] dark:text-slate-50">
              {view === 'monitor' ? 'Live Monitor' : 'Review Submissions'}
            </h1>
            <p className="text-gray-500 text-sm mt-1 dark:text-slate-300">
              {view === 'monitor'
                ? 'Live maintenance monitor & visual verification'
                : 'Review task submissions and resolve disputes'}
            </p>
          </div>

          {view === 'monitor' ? (
            <>
              <TaskStatsSection tasks={filteredLogs} />

              {generateMessage && (
                <div className="px-4 py-3.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-semibold">
                  {generateMessage}
                </div>
              )}

              <TaskFilterSection
                onGenerate={handleGenerateClick}
                showGenerateButton={isAdminOrSuperAdmin}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                frequencyFilter={frequencyFilter}
                setFrequencyFilter={setFrequencyFilter}
                areaFilter={areaFilter}
                setAreaFilter={setAreaFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <TaskListSection
                tasks={filteredLogs}
                onViewDetails={(log) => setSelectedId(log._id)}
                isLoading={isLoading}
              />
            </>
          ) : (
            <ReviewSubmissionsTab />
          )}
        </div>
      </main>

      {selectedLog && (
        <TaskLogDetailModal log={selectedLog} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
};

export default TaskMonitorPage;