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
import type { Task } from '../../types/task';

export const TaskMonitorPage: React.FC = () => {
  const { logs, loading: logsLoading, handleComplete, handleGenerate } = useTaskLogs();
  const { tasks, loading: tasksLoading, handleCreate, handleUpdate, handleArchive } = useTasks();
  const { role } = useAuth();

  const userRole = (role ?? 'custodian') as 'admin' | 'custodian';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'monitor' | 'manage'>('monitor');
  
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

  const handleSubmit = async (formData: any) => {
    if (editingTask) {
      await handleUpdate(editingTask._id, formData);
    } else {
      await handleCreate(formData);
    }
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

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
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Task Tracking</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">
              {activeTab === 'monitor' ? "Live maintenance monitor" : "Manage master task templates"}
            </p>
          </div>

          {/* Admin Toggle Tabs */}
          {userRole === 'admin' && (
            <div className="flex bg-gray-200/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('monitor')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${activeTab === 'monitor' ? 'bg-white shadow-sm text-[#113129]' : 'text-gray-500'}`}
              >
                Live Monitor
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${activeTab === 'manage' ? 'bg-white shadow-sm text-[#113129]' : 'text-gray-500'}`}
              >
                Manage Tasks
              </button>
            </div>
          )}
        </div>

        {/* Stats only relevant for Live Monitoring */}
        {activeTab === 'monitor' && <TaskStatsSection tasks={filteredLogs} />}
        
        {/* generates an error message */}
        {generateMessage && (
            <div className={`mt-4 px-4 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
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

        <div className="mt-8">
          <TaskFilterSection 
            onAddTask={() => setIsModalOpen(true)}
            onGenerate={handleGenerateClick}
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
              onEdit={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      
        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onCreate={handleSubmit}
          onSuccess={() => {}}
          initialData={editingTask}
        />

      </main>
    </div>
  );
};