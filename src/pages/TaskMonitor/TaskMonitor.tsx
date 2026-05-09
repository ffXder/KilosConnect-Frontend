import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from './TaskFilterSection';
import TaskListSection from './TaskListSection';
import AddTaskModal from './AddITaskModals';
import { useAuth } from '../../hooks/useAuth';

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
  // --- MORNING SHIFT ---
  { _id: 'm1', title: 'Preparation & Inventory Check', description: 'Check tissue, soap, alcohol, and magnesium chalk levels.', area: 'General Storage', frequency: 'Daily', status: 'Pending', startTime: '06:00', endTime: '06:30', isArchived: false },
  { _id: 'm2', title: 'Morning Mopping (Zone A)', description: 'Mop Mezzanine and Powerlifting Area.', area: 'Mezzanine', frequency: 'Daily', status: 'Pending', startTime: '06:30', endTime: '07:00', isArchived: false },
  { _id: 'm3', title: 'Morning Mopping (Zone B)', description: 'Mop Open WOD and CrossFit Area.', area: 'Open WOD Area', frequency: 'Daily', status: 'Pending', startTime: '07:00', endTime: '07:30', isArchived: false },
  { _id: 'm4', title: 'Deep Clean: Mezzanine', description: 'Deep clean Hammer Strength and Lifefitness equipment.', area: 'Mezzanine', frequency: 'Daily', status: 'Pending', startTime: '07:30', endTime: '08:30', isArchived: false },
  { _id: 'm5', title: 'Deep Clean: Powerlifting Area', description: 'Deep clean Eleiko plates and racks.', area: 'Powerlifting Area', frequency: 'Daily', status: 'Pending', startTime: '08:30', endTime: '09:30', isArchived: false },
  { _id: 'm6', title: 'Deep Clean: CrossFit Area', description: 'Deep clean cardiovascular equipment (Bikes/Rowers).', area: 'CrossFit Area', frequency: 'Daily', status: 'Pending', startTime: '09:30', endTime: '10:30', isArchived: false },

  // --- MID-DAY SHIFT ---
  { _id: 'd1', title: 'Mid-Day Inventory & General Cleaning', description: 'Refill supplies and organize high-traffic areas.', area: 'General Storage', frequency: 'Daily', status: 'Pending', startTime: '12:00', endTime: '13:00', isArchived: false },
  { _id: 'd2', title: 'Detailed Equipment Inspection', description: 'Check cables, pulleys, and structural integrity.', area: 'Open WOD Area', frequency: 'Daily', status: 'Pending', startTime: '13:00', endTime: '14:00', isArchived: false },
  { _id: 'd3', title: 'Secondary Chalk Refill', description: 'Refill all magnesium chalk buckets.', area: 'Weightlifting Area', frequency: 'Daily', status: 'Pending', startTime: '15:00', endTime: '15:30', isArchived: false },

  // --- EVENING SHIFT ---
  { _id: 'e1', title: 'Post-Peak Mopping', description: 'Mopping high-traffic zones after peak hours.', area: 'Open WOD Area', frequency: 'Daily', status: 'Pending', startTime: '18:00', endTime: '19:00', isArchived: false },
  { _id: 'e2', title: 'Nightly Deep Clean: Weightlifting Area', description: 'End-of-day cleaning for platforms and plates.', area: 'Weightlifting Area', frequency: 'Daily', status: 'Pending', startTime: '21:00', endTime: '22:00', isArchived: false },
  { _id: 'e3', title: 'Final Facility Walkthrough', description: 'Secure facility and perform final check of all zones.', area: 'Maintenance Storage', frequency: 'Daily', status: 'Pending', startTime: '23:00', endTime: '00:00', isArchived: false },

  // --- WEEKLY TASKS ---
  { _id: 'w1', title: 'Deep Clean: Yoga Mats & Accessories', description: 'Sanitize all mats, foam rollers, and yoga blocks.', area: 'Mezzanine', frequency: 'Weekly', status: 'Pending', startTime: '10:00', endTime: '11:30', isArchived: false },
  { _id: 'w2', title: 'Glass & Window Cleaning', description: 'Clean all glass partitions and windows across the facility.', area: 'Open WOD Area', frequency: 'Weekly', status: 'Pending', startTime: '14:00', endTime: '15:30', isArchived: false },
  { _id: 'w3', title: 'Air Conditioning Filter Maintenance', description: 'Remove and clean dust filters from AC units.', area: 'General Storage', frequency: 'Weekly', status: 'Pending', startTime: '15:30', endTime: '17:00', isArchived: false }
];

export const TaskMonitorPage: React.FC = () => {
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
  
  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      <main className="flex-1 ml-[240px] p-8">
        <div className="mb-8">
          <h1 className="[font-family:'Poppins',Helvetica] text-3xl font-bold text-gray-900 tracking-tigh">Task Tracking</h1>
          <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-1">Monitor and manage facility maintenance schedules</p>
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

