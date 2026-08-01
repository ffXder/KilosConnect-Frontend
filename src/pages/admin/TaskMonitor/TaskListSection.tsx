import React from 'react';
import type { TaskLog } from '../../../types/task';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  ClipboardX, 
  Calendar, 
  Camera, 
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';

interface TaskListProps {
  tasks: TaskLog[]; 
  onToggleStatus: (id: string) => void;
  onArchive?: (id: string) => void;
  onViewVerification?: (taskLog: TaskLog) => void;
  isLoading?: boolean;
}

const TaskListSection: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleStatus, 
  onViewVerification,
  isLoading 
}) => {
  const formatTime = (time?: string) => {
    if (!time) return "--:--";
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const getPriorityStyle = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-amber-500';
      default:
        return 'border-l-4 border-l-slate-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} />
            COMPLETED
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            IN PROGRESS
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={12} />
            MISSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="bg-[#fcfcfc] border border-[#e2e8f0] rounded-2xl md:rounded-[32px] p-4 md:p-8 shadow-xs min-h-[300px] flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#113129] animate-spin" />
          <p className="text-slate-400 mt-4 font-medium text-sm">Loading live monitor...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <ClipboardX size={48} className="text-slate-300 mb-4" />
          <p className="text-center text-slate-500 font-medium text-sm">No active tasks match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {tasks.map((log) => {
            const isCompleted = log.status === 'Completed';

            return (
              <div 
                key={log._id} 
                className={`bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 ${getPriorityStyle(log.task?.priority)}`}
              >
                {/* Header: Area & Status Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg truncate max-w-[140px]">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{log.task?.area || 'General Area'}</span>
                    </span>
                    {getStatusBadge(log.status)}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`font-bold text-base leading-snug ${isCompleted ? 'text-slate-400 line-through' : 'text-[#1e293b]'}`}>
                    {log.task?.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {log.task?.description || "No description provided."}
                  </p>
                </div>

                {/* Task Details Section */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Clock size={14} className="text-slate-400" />
                      Schedule
                    </span>
                    <span className="text-[#1e293b] font-semibold">
                      {formatTime(log.task?.startTime)} - {formatTime(log.task?.endTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      Type
                    </span>
                    <span className="text-[#1e293b] font-semibold">{log.task?.frequency}</span>
                  </div>
                </div>

                {/* Submitted Photo Preview */}
                {log.submittedPhoto && onViewVerification && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <img 
                        src={log.submittedPhoto} 
                        alt="Proof" 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200" 
                      />
                      <span className="text-[11px] font-semibold text-slate-600">Live Photo Attached</span>
                    </div>
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  {/* View Live Photo / Reference button if photo is not displayed directly above */}
                  {!log.submittedPhoto && onViewVerification && (
                    <button
                      type="button"
                      onClick={() => onViewVerification(log)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="View Photo Standard or Live Proof"
                    >
                      <Eye size={16} />
                    </button>
                  )}

                  {!isCompleted ? (
                    <button 
                      onClick={() => onToggleStatus(log._id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#113129] hover:bg-[#0a211b] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      <Check size={14} strokeWidth={3} />
                      Mark as Completed
                    </button>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center px-1">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                        Completed
                      </span>
                      {log.completedBy && (
                        <span className="text-[11px] text-slate-400 truncate">
                          by {log.completedBy.firstName}
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskListSection;