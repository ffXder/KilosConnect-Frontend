import React from 'react';
import { Trash2, Calendar, MapPin, Edit3, Loader2 } from 'lucide-react';

interface TaskManagementSectionProps {
  tasks: any[];
  onArchive: (id: string) => void;
  onEdit: (task: any) => void; // Added onEdit prop
  loading: boolean;
}

const frequencyStyle: Record<string, string> = {
  Daily: 'bg-purple-100 text-purple-600 dark:bg-purple-400 dark:text-purple-50',
  Weekly: 'bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-50',
  Monthly: 'bg-green-100 text-green-600 dark:bg-green-500 dark:text-green-50'
}

const TaskManagementSection: React.FC<TaskManagementSectionProps> = ({ 
  tasks, 
  onArchive, 
  onEdit, 
  loading 
}) => {
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[32px] py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#113129] animate-spin" />
        <p className="text-gray-400 mt-4 font-medium">Loading master tasks...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full dark:bg-slate-950 dark:border-slate-600 transition-color duration-300">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className='bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:bg-slate-950 transition-color duration-300 dark:border-slate-600'>
            <th className="py-4 px-6 dark:text-slate-300">Task Detail</th>
            <th className="py-4 px-6 dark:text-slate-300">Time</th>
            <th className="py-4 px-6 dark:text-slate-300">Area</th>
            <th className="py-4 px-6 dark:text-slate-300">Frequency</th>
            <th className="py-4 px-6 dark:text-slate-300">Day</th>
            <th className="py-4 px-6 text-right dark:text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm dark:bg-slate-950 transition-color duration-300 dark:divide-slate-800">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-16 text-center text-gray-400">
                No master tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-slate-800/50">
                <td className="px-4 py-6">
                  <div className="font-bold text-[#1e293b] dark:text-slate-300">{task.title}</div>
                </td>
                <td className="px-4 py-6">
                  <div className="text-xs text-gray-470 flex items-center gap-1 mt-1  dark:text-slate-300">
                    <Calendar size={12} /> {task.startTime} - {task.endTime}
                  </div>
                </td>
                <td className="px-4 py-6">
                  <span className="flex items-center gap-2 text-sm text-gray-600  dark:text-slate-300">
                    <MapPin size={14} className="text-gray-400 dark:text-slate-300" /> {task.area}
                  </span>
                </td>
                <td className="px-4 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${frequencyStyle[task.frequency] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {task.frequency}
                  </span>
                </td>
                <td className="px-4 py-6">
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                    {task.dayType === null ? "Everyday" : task.dayType}
                  </span>
                </td>
                <td className="px-4 py-6 text-right">
                  <div className="flex justify-end   gap-2">
                    {/* EDIT BUTTON */}
                    <button 
                      onClick={() => onEdit(task)}
                      className="text-blue-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Task"
                    >
                      <Edit3 size={18} />
                    </button>

                    {/* DELETE/ARCHIVE BUTTON */}
                    <button 
                      onClick={() => { 
                        if(window.confirm("Delete this master task? This will stop future logs from being created.")) 
                          onArchive(task._id) 
                      }}
                      className="text-red-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManagementSection;