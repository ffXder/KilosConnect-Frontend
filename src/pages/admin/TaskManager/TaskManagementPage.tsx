import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import TaskFilterSection from './TaskFilterSection';
import TaskManagementSection from './TaskTableSection';
import AddTaskModal from './AddITaskModals';
import { AreaQrModal } from './AreaQRModal';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTask';
import type { Task } from '../../../types/task';
import { useSearchParams } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const AREAS = [
  "Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area",
  "Weightlifting Area", "General Storage", "Maintenance Storage",
  "Multiple Area", "Front Desk Area", "Outdoor Area", "CR", "1st Floor", "2nd Floor"
];

export const TaskManagementPage: React.FC = () => {
  const { tasks, loading, handleCreate, handleUpdate, handleArchive } = useTasks();
  const { role } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') ?? '';
  const selectedFrequency = searchParams.get('frequency') ?? 'All';
  const selectedArea = searchParams.get('area') ?? 'All Areas';

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'All Areas') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFrequency = selectedFrequency === 'All' ? true : task.frequency === selectedFrequency;
    const matchesArea = selectedArea === 'All Areas' ? true : task.area === selectedArea;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFrequency && matchesArea && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-color duration-300">
      <SidebarNavigationSection userRole={(role ?? 'custodian') as 'admin' | 'custodian'} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-slate-50">
              Manage Tasks
            </h1>
            
            {role === 'admin' && (
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-5 py-3 rounded-[16px] text-[14px] font-bold flex items-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer dark:bg-slate-900 dark:shadow-none transition-color duration-300 dark:border-slate-700"
              >
                <QrCode size={18} className="text-[#113129] dark:text-slate-50" />
                <span className="dark:text-slate-50">Area QR Codes</span>
              </button>
            )}
          </div>

          <TaskFilterSection 
            onAddTask={() => { setEditingTask(null); setIsModalOpen(true); }}
            showAddButton={true}
            hideStatus={true}
            searchTerm={searchTerm}
            setSearchTerm={(val) => updateParam('q', val)}
            frequencyFilter={selectedFrequency}
            setFrequencyFilter={(val) => updateParam('frequency', val)}
            areaFilter={selectedArea}
            setAreaFilter={(val) => updateParam('area', val)}
            statusFilter="" 
            setStatusFilter={() => {}}
          />

          <TaskManagementSection 
            tasks={filteredTasks} 
            onArchive={handleArchive} 
            loading={loading} 
            onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }} 
          />
        </div>

        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => { setEditingTask(null); setIsModalOpen(false); }} 
          onCreate={editingTask ? (d) => handleUpdate(editingTask._id, d) : handleCreate}
          onSuccess={() => {}}
          initialData={editingTask}
        />

        <AreaQrModal 
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          areas={AREAS}
        />
      </main>
    </div>
  );
};

export default TaskManagementPage;