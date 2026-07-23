import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from './TaskFilterSection';
import TaskListSection from './TaskListSection';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../contexts/SidebarContext';
import { useTaskLogs } from '../../hooks/useTaskLog';

export const TaskMonitorPage: React.FC = () => {
  const { logs, loading: logsLoading, handleComplete, handleGenerate } = useTaskLogs();
  const { role } = useAuth();
  const { isExpanded } = useSidebar();
  const sidebarMargin = isExpanded ? "lg:ml-[240px]" : "ml-[78px]";

  const userRole = (role ?? 'custodian') as 'admin' | 'custodian';
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const handleGenerateClick = async () => {
      const result = await handleGenerate();
      if (result?.message) {
          setGenerateMessage(result.message);
          setTimeout(() => setGenerateMessage(null), 3000); // auto dismiss after 3s
      }
  };

  // filter task logs
  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'All Tasks' ? true : log.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'All' ? true : log.task.frequency === frequencyFilter;
    const matchesArea = areaFilter === 'All Areas' ? true : log.task.area === areaFilter;
    const matchesSearch = log.task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesFrequency && matchesArea && matchesSearch;
  });

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      <main className={`flex-1 w-full ${sidebarMargin} p-4 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden`}>
        
        <div className="flex justify-between items-end mb-4 sm:mb-6 lg:mb-8">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Live Task Monitor</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-xs sm:text-sm mt-0.5">
              Live maintenance monitor
            </p>
          </div>
        </div>

        <TaskStatsSection tasks={filteredLogs} />
        
        {/* generates an error message */}
        {generateMessage && (
            <div className={`mt-3 sm:mt-4 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                generateMessage.includes('generated')
                    ? 'border-green-200 bg-green-50 text-green-700'  // success
                    : 'border-yellow-200 bg-yellow-50 text-yellow-700' // warning
            }`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                    generateMessage.includes('generated') ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                {generateMessage}
            </div>
        )}

        <div className="mt-4 sm:mt-6 lg:mt-8">
          <TaskFilterSection 
            onAddTask={() => {}}
            onGenerate={handleGenerateClick}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            frequencyFilter={frequencyFilter}
            setFrequencyFilter={setFrequencyFilter}
            areaFilter={areaFilter}
            setAreaFilter={setAreaFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAddButton={false}
            showGenerateButton={userRole === 'admin'}
            hideStatus={false}
          />
        </div>

        <div className="mt-4 sm:mt-6 lg:mt-8">
          <TaskListSection 
            tasks={filteredLogs} 
            onToggleStatus={handleComplete} 
            onArchive={() => {}} 
          />
        </div>

      </main>
    </div>
  );
};
