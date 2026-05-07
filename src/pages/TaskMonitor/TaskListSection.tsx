import React from 'react';
import { Clock, MapPin, Trash2, CheckCircle2, Box } from 'lucide-react';

interface TaskListProps {
  tasks: any[];
  onToggleStatus: (id: string) => void;
  onArchive: (id: string) => void;
}

const TaskListSection: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onArchive }) => {
  const formatTime = (time: string) => {
    if (!time) return "--:--";
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  return (
    /* This is the "Large Card" container from the reference image */
    <div className="bg-[#fcfcfc] border border-[#e2e8f0] rounded-[32px] p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-10 font-medium">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            /* Individual Task Card */
            <div 
              key={task._id} 
              className="bg-white border border-[#e2e8f0] rounded-[24px] p-6 flex flex-col relative transition-all hover:border-[#cbd5e1]"
            >
              {/* Top Row: Icon and Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-[#f0fdfa] text-[#113129] rounded-xl">
                  <Box size={20} strokeWidth={2.5} />
                </div>
                <span className={`text-[11px] font-black px-3 py-1.5 rounded-full tracking-wider ${
                  task.status === 'Completed' 
                    ? 'bg-[#f0fdf4] text-[#16a34a]' 
                    : 'bg-[#fff7ed] text-[#ea580c]'
                }`}>
                  {task.status.toUpperCase()}
                </span>
              </div>

              {/* Content Section */}
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${
                    task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-[#1e293b]'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-[14px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>

                {/* Metadata Items */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-3 text-[13px] font-semibold">
                    <MapPin size={16} className="text-[#94a3b8]" />
                    <span className="text-[#64748b]">Found in:</span>
                    <span className="text-[#1e293b]">{task.area}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-semibold">
                    <Clock size={16} className="text-[#94a3b8]" />
                    <span className="text-[#64748b]">Schedule:</span>
                    <span className="text-[#1e293b]">{formatTime(task.startTime)} - {formatTime(task.endTime)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                {task.status !== 'Completed' ? (
                  <button 
                    onClick={() => onToggleStatus(task._id)}
                    className="flex-1 bg-[#113129] text-white py-3.5 rounded-[12px] text-[14px] font-bold hover:bg-[#0a211b] transition-all active:scale-95"
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <div className="flex-1 flex items-center gap-2 text-[#16a34a] font-bold text-[13px]">
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                    <span>Completed</span>
                  </div>
                )}
                
                <button 
                  onClick={() => { if(window.confirm("Archive task?")) onArchive(task._id) }} 
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskListSection;