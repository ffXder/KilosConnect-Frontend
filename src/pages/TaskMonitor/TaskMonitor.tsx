import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from './TaskFilterSection';
import TaskListSection from './TaskListSection';
import AddTaskModal from './AddITaskModals';

interface Task {
  _id: string;
  title: string;
  description?: string;
  area: string;
  frequency: string;
  status: string;
  startTime: string;
  endTime: string;
  isArchived: boolean;
}

const MOCK_DATA: Task[] = [
  { _id: '1', title: 'Deep Clean Powerlifting Racks', description: 'Wipe down all metal surfaces and check for loose bolts.', area: 'Powerlifting Area', frequency: 'Daily', status: 'Completed', startTime: '08:00', endTime: '09:30', isArchived: false },
  { _id: '2', title: 'Inventory Check: Protein Shakes', description: 'Count remaining stock in the café chiller.', area: 'Café', frequency: 'Daily', status: 'Pending', startTime: '10:00', endTime: '10:30', isArchived: false },
  { _id: '3', title: 'Mop Mezzanine Yoga Mats', description: 'Use the lavender-scented disinfectant.', area: 'Mezzanine', frequency: 'Weekly', status: 'Pending', startTime: '13:00', endTime: '14:00', isArchived: false },
  { _id: '4', title: 'Aircon Filter Maintenance', description: 'Wash filters in the CrossFit area.', area: 'CrossFit Area', frequency: 'Monthly', status: 'Pending', startTime: '15:00', endTime: '17:00', isArchived: false },
];

const TaskMonitor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_DATA);
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks
    .filter(task => {
      const matchesStatus = statusFilter === 'All Tasks' ? true : task.status === statusFilter;
      const matchesFrequency = frequencyFilter === 'All' ? true : task.frequency === frequencyFilter;
      const matchesArea = areaFilter === 'All Areas' ? true : task.area === areaFilter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (task.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesFrequency && matchesArea && matchesSearch && !task.isArchived;
    })
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const handleAddTask = (newTask: any) => setTasks(prev => [...prev, newTask]);
  const handleToggleStatus = (id: string) => setTasks(prev => prev.map(t => t._id === id ? { ...t, status: 'Completed' } : t));
  const handleArchiveTask = (id: string) => setTasks(prev => prev.filter(t => t._id !== id));

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection />
      <main className="flex-1 ml-[240px] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0f172a]">Task Tracking</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Monitor and manage facility maintenance schedules</p>
        </div>
        
        <TaskStatsSection tasks={tasks} />
        
        {/* Separate Filter Section Container[cite: 7, 9] */}
        <div className="mt-8">
          <TaskFilterSection 
            onAddTask={() => setIsModalOpen(true)} 
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

        {/* Separate Task List Section Container */}
        <div className="mt-8">
          <TaskListSection 
            tasks={filteredTasks} 
            onToggleStatus={handleToggleStatus}
            onArchive={handleArchiveTask}
          />
        </div>

        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleAddTask}
        />
      </main>
    </div>
  );
};

export default TaskMonitor;