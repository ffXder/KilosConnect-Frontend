import React from 'react';
import type { TaskLog } from '../../types/task';
import { Clock, MapPin, CheckCircle2, Box, Loader2, ClipboardX, Calendar1 } from 'lucide-react';

interface TaskListProps {
  tasks: TaskLog[]; 
  onToggleStatus: (id: string) => void;
  onArchive: (id: string) => void;
  isLoading?: boolean; // Keep this to handle the loading state
}

const TaskListSection: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onArchive, isLoading }) => {
  const formatTime = (time?: string) => {
    if (!time) return "--:--";
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };
  

  return (
    <div className="bg-[#fcfcfc] border border-[#e2e8f0] rounded-[32px] p-8 shadow-sm min-h-[300px] flex flex-col">
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#113129] animate-spin" />
          <p className="text-gray-400 mt-4 font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <ClipboardX size={48} className="text-gray-300 mb-4" />
          <p className="text-center text-gray-400 font-medium">No tasks found.</p>
        </div>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((log) => (
            <div 
              key={log._id} 
              className="bg-white border border-[#e2e8f0] rounded-[24px] p-6 flex flex-col relative transition-all hover:border-[#cbd5e1]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-[#f0fdfa] text-[#113129] rounded-xl">
                  <Box size={20} strokeWidth={2.5} />
                </div>
                <span className={`text-[11px] font-black px-3 py-1.5 rounded-full tracking-wider ${
                  log.status === 'Completed' 
                    ? 'bg-[#f0fdf4] text-[#16a34a]' 
                    : 'bg-[#fff7ed] text-[#ea580c]'
                }`}>
                  {log.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${
                    log.status === 'Completed' ? 'text-gray-400 line-through' : 'text-[#1e293b]'
                  }`}>
                    {log.task.title}
                  </h3>
                  <p className="text-[14px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {log.task.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-3 text-[13px] font-semibold">
                    <MapPin size={16} className="text-[#94a3b8]" />
                    <span className="text-[#64748b]">Area:</span>
                    <span className="text-[#1e293b]">{log.task.area}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-semibold">
                    <Clock size={16} className="text-[#94a3b8]" />
                    <span className="text-[#64748b]">Schedule:</span>
                    <span className="text-[#1e293b]">
                      {formatTime(log.task.startTime)} - {formatTime(log.task.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-semibold">
                    <Calendar1 size={16} className="text-[#94a3b8]" />
                    <span className="text-[#64748b]">Type:</span>
                    <span className="text-[#1e293b]">{log.task.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                {log.status !== 'Completed' ? (
                  <button 
                    onClick={() => onToggleStatus(log._id)}
                    className="flex-1 bg-[#113129] text-white py-3.5 rounded-[12px] text-[14px] font-bold hover:bg-[#0a211b] transition-all active:scale-95"
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[13px]">
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                      <span>Completed</span>
                    </div>
                    {log.completedBy && (
                       <span className="text-[12px] text-gray-400">by {log.completedBy.firstName}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskListSection;