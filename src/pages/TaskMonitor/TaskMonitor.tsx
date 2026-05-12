import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from './TaskFilterSection';
import TaskListSection from './TaskListSection';
import TaskManagementSection from './TaskManagementSection'; 
import AddTaskModal from './AddITaskModals';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTask';
import { useTaskLogs } from '../../hooks/useTaskLog';
import { AddItemModal } from '../Inventory/AddItemModal';

export const TaskMonitorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'manage'>('monitor');
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');

  const { logs, loading: logsLoading, handleComplete, handleGenerate } = useTaskLogs();
  const { tasks, loading: tasksLoading, handleCreate, handleArchive } = useTasks();
  const { role } = useAuth();

  const userRole = (role ?? 'custodian') as 'admin' | 'custodian';

  // filter task logs
  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'All Tasks' ? true : log.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'All' ? true : log.task.frequency === frequencyFilter;
    const matchesArea = areaFilter === 'All Areas' ? true : log.task.area === areaFilter;
    const matchesSearch = log.task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesFrequency && matchesArea && matchesSearch;
  });

  // filter tasks
  const filteredMasterTasks = tasks.filter(task => {
    const matchesFrequency = frequencyFilter === 'All' ? true : task.frequency === frequencyFilter;
    const matchesArea = areaFilter === 'All Areas' ? true : task.area === areaFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFrequency && matchesArea && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      <main className="flex-1 ml-[240px] p-8">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Tracking</h1>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'monitor' ? "Live maintenance monitor" : "Manage master task templates"}
            </p>
          </div>

          {/* Admin Toggle Tabs */}
          {userRole === 'admin' && (
            <div className="flex bg-gray-200/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('monitor')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'monitor' ? 'bg-white shadow-sm text-[#113129]' : 'text-gray-500'}`}
              >
                Live Monitor
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'manage' ? 'bg-white shadow-sm text-[#113129]' : 'text-gray-500'}`}
              >
                Manage Tasks
              </button>
            </div>
          )}
        </div>

        {/* Stats only relevant for Live Monitoring */}
        {activeTab === 'monitor' && <TaskStatsSection tasks={filteredLogs} />}
        
        <div className="mt-8">
          <TaskFilterSection 
            onAddTask={() => setIsModalOpen(true)}
            onGenerate={handleGenerate}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            frequencyFilter={frequencyFilter}
            setFrequencyFilter={setFrequencyFilter}
            areaFilter={areaFilter}
            setAreaFilter={setAreaFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAddButton={activeTab === 'manage' && userRole === 'admin'} // show add task to admins
            showGenerateButton={activeTab === 'monitor' && userRole === 'admin'} //generate button to admins
            hideStatus={activeTab === 'manage'} //hide status in manage task
          />
        </div>

        <div className="mt-8">
          {activeTab === 'monitor' ? (
              <TaskListSection 
                tasks={filteredLogs} 
                onToggleStatus={handleComplete} 
                onArchive={handleArchive} 
              />  
          ) : (
            <TaskManagementSection 
              tasks={filteredMasterTasks} 
              onArchive={handleArchive} 
              loading={tasksLoading}
              onEdit={(tasks) =>{
                // WIP just a placeholder
                console.log("Edit this task:", tasks);
              }}
            />
          )}
        </div>
      
          <AddTaskModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onCreate={handleCreate}
            onSuccess={() => setIsModalOpen(false)}
          />

      </main>
    </div>
  );
};