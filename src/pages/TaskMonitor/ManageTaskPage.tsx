import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import TaskFilterSection from './TaskFilterSection';
import TaskManagementSection from './TaskManagementSection';
import AddTaskModal from './AddITaskModals';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTask';
import type { Task } from '../../types/task';

const ManageTaskPage: React.FC = () => {
  const { tasks, loading, handleCreate, handleUpdate, handleArchive } = useTasks();
  const { role } = useAuth();

  const userRole = (role ?? 'custodian') as 'admin' | 'custodian';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter States
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');

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
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Manage Tasks</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">
              Manage master task templates
            </p>
          </div>
        </div>

        <div className="mt-8">
          <TaskFilterSection 
            onAddTask={() => setIsModalOpen(true)}
            statusFilter="All Tasks"
            setStatusFilter={() => {}}
            frequencyFilter={frequencyFilter}
            setFrequencyFilter={setFrequencyFilter}
            areaFilter={areaFilter}
            setAreaFilter={setAreaFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAddButton={userRole === 'admin'}
            showGenerateButton={false}
            hideStatus={true}
          />
        </div>

        <div className="mt-8">
          <TaskManagementSection 
            tasks={filteredMasterTasks} 
            onArchive={handleArchive} 
            loading={loading}
            onEdit={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
          />
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

export default ManageTaskPage;
