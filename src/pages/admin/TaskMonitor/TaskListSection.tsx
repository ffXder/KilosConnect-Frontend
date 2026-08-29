import React from 'react';
import type { TaskLog } from '../../../types/task';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  ClipboardX, 
  AlertCircle,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatTo12Hour } from '../../../utils/formatter'; 

interface TaskListProps {
  tasks: TaskLog[]; 
  onToggleStatus: (id: string, photoFile?: File, isLiveCamera?: boolean) => Promise<TaskLog> | void;
  onArchive?: (id: string) => Promise<void> | void;
  onViewVerification?: (taskLog: any) => void;
  onViewDetails?: (taskLog: TaskLog) => void;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const TaskListSection: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleStatus, 
  onViewDetails,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {

  const getPriorityBadge = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-50 text-red-700 border border-red-200">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> COMPLETED
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> PENDING REVIEW
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={12} /> MISSED
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
    <div className="bg-[#fcfcfc] border border-[#e2e8f0] rounded-2xl md:rounded-[24px] overflow-hidden shadow-xs min-h-[350px] flex flex-col justify-between">
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
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 md:px-6">Task Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Proof</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right md:pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm">
              {tasks.map((log) => {
                const isCompleted = log.status === 'Completed';

                return (
                  <tr 
                    key={log._id} 
                    onClick={() => onViewDetails && onViewDetails(log)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer select-none"
                  >
                    {/* Task Title & Description */}
                    <td className="py-4 px-4 md:px-6 max-w-xs">
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-[#113129] transition-colors'}`}>
                          {log.task?.title || 'Untitled Task'}
                        </span>
                        {log.task?.description && (
                          <span className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                            {log.task.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Area / Location */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span>{log.task?.area || 'General Area'}</span>
                      </span>
                    </td>

                    {/* Time & Frequency */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          {formatTo12Hour(log.task?.startTime)} - {formatTo12Hour(log.task?.endTime)}
                        </span>
                        <span className="text-slate-400 text-[11px] capitalize">
                          {log.task?.frequency || 'Daily'}
                        </span>
                      </div>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getPriorityBadge(log.task?.priority)}
                    </td>

                    {/* Photo / Proof */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {log.submittedPhoto ? (
                        <img 
                          src={log.submittedPhoto} 
                          alt="Proof" 
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs" 
                        />
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-0.5">
                        {getStatusBadge(log.status)}
                        {isCompleted && log.completedBy && (
                          <span className="text-[10px] text-slate-400 ml-1">
                            by {log.completedBy.firstName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions Area */}
                    <td className="py-4 px-4 md:pr-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Quick View Button */}
                        {onViewDetails && (
                          <button
                            type="button"
                            onClick={() => onViewDetails(log)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {/* Quick Complete Toggle */}
                        {!isCompleted ? (
                          <button 
                            type="button"
                            onClick={() => onToggleStatus(log._id)}
                            className="inline-flex items-center gap-1 bg-[#113129] hover:bg-[#0a211b] text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs cursor-pointer"
                          >
                            <Check size={13} strokeWidth={3} />
                            <span>Complete</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 px-2 py-1">
                            <CheckCircle2 size={15} strokeWidth={2.5} />
                            <span>Done</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && tasks.length > 0 && totalPages > 1 && (
        <div className="bg-white border-t border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Page <span className="text-slate-900 font-bold">{currentPage}</span> of{' '}
            <span className="text-slate-900 font-bold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListSection;