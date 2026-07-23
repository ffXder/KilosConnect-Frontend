import React from 'react';
import { Trash2, Calendar, MapPin, Edit2, Loader2 } from 'lucide-react';

interface TaskManagementSectionProps {
  tasks: any[];
  onArchive: (id: string) => void;
  onEdit: (task: any) => void; // Added onEdit prop
  loading: boolean;
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
    <div className="bg-white border border-gray-200 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">Task Detail</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">Area</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">Frequency</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">Day</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">
                  No master tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                    <div className="font-bold text-[#1e293b] text-sm sm:text-base">{task.title}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 mt-0.5 sm:mt-1">
                      <Calendar size={10} className="hidden sm:block" /> {task.startTime} - {task.endTime}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                    <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <MapPin size={12} className="text-gray-400 hidden sm:block" /> {task.area}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-tight ${
                      task.frequency === 'Daily' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {task.frequency}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                    <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      {task.dayType === null ? "Everyday" : task.dayType}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <button 
                        onClick={() => onEdit(task)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Task"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => { 
                          if(window.confirm("Delete this master task? This will stop future logs from being created.")) 
                            onArchive(task._id) 
                        }}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManagementSection;