import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from '../TaskManager/TaskFilterSection';
import TaskListSection from './TaskListSection';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTask';
import { useTaskLogs } from '../../hooks/useTaskLog';

export const TaskMonitorPage: React.FC = () => {
  const { logs, handleComplete, handleGenerate } = useTaskLogs();
  const { handleArchive } = useTasks();
  const { role } = useAuth();

  const userRole = (role ?? 'custodian') as 'admin' | 'custodian';
  
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const handleGenerateClick = async () => {
      const result = await handleGenerate();
      if (result?.message) {
          setGenerateMessage(result.message);
          setTimeout(() => setGenerateMessage(null), 3000);
      }
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'All Tasks' ? true : log.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'All' ? true : log.task.frequency === frequencyFilter;
    const matchesArea = areaFilter === 'All Areas' ? true : log.task.area === areaFilter;
    const matchesSearch = log.task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesFrequency && matchesArea && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Task Tracking</h1>
            <p className="text-gray-500 text-sm mt-0.5">Live maintenance monitor</p>
          </div>

          <TaskStatsSection tasks={filteredLogs} />
          
          {generateMessage && (
              <div className="mt-4 px-4 py-3.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-semibold">
                  {generateMessage}
              </div>
          )}

          <div className="mt-8">
            <TaskFilterSection 
              onGenerate={handleGenerateClick}
              showGenerateButton={userRole === 'admin'}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              frequencyFilter={frequencyFilter}
              setFrequencyFilter={setFrequencyFilter}
              areaFilter={areaFilter}
              setAreaFilter={setAreaFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="mt-8">
            <TaskListSection 
              tasks={filteredLogs} 
              onToggleStatus={handleComplete} 
              onArchive={handleArchive} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};
export default TaskMonitorPage;