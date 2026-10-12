import React from 'react';
import type { TaskLog } from '../../../types/task';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Loader2,
  ClipboardX,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { formatTo12Hour } from '../../../utils/formatter';
import { formatDate } from '../../../utils/formatter';

interface TaskListProps {
  tasks: TaskLog[];
  onViewDetails: (taskLog: TaskLog) => void;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const TaskListSection: React.FC<TaskListProps> = ({
  tasks,
  onViewDetails,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            In Progress
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-900 animate-pulse" /> Pending Review
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={12} /> Missed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-[#fcfcfc] border border-[#e2e8f0] rounded-2xl md:rounded-[24px] overflow-hidden shadow-xs min-h-[350px] flex flex-col justify-between dark:bg-slate-900 transition-colors duration-300 dark:border-slate-700">
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#113129] animate-spin" />
          <p className="text-slate-400 mt-4 font-medium text-sm dark:text-slate-300">Loading live monitor...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <ClipboardX size={48} className="text-slate-300 mb-4 dark:text-slate-500" />
          <p className="text-center text-slate-500 font-medium text-sm dark:text-slate-300">No active tasks match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
                <th className="py-3.5 px-4 md:px-6">Task Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Date & Schedule</th>
                <th className="py-3.5 px-4 md:pr-6">Status</th>
                <th className="py-3.5 px-4 md:pr-6">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm dark:divide-slate-700 dark:bg-slate-900">
              {tasks.map((log) => {
                const isCompleted = log.status === 'Completed';

                return (
                  <tr
                    key={log._id}
                    onClick={() => onViewDetails(log)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer select-none dark:hover:bg-slate-800/60"
                  >
                    {/* Task Title & Description */}
                    <td className="py-4 px-4 md:px-6 max-w-xs">
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isCompleted ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-900 group-hover:text-[#113129] transition-colors dark:text-slate-100 dark:group-hover:text-emerald-300'}`}>
                          {log.task?.title || 'Untitled Task'}
                        </span>
                        {log.task?.description && (
                          <span className="text-xs text-slate-400 truncate max-w-xs mt-0.5 dark:text-slate-400">
                            {log.task.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Area / Location */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg dark:bg-slate-800 dark:text-slate-200">
                        <MapPin size={13} className="text-slate-400 shrink-0 dark:text-slate-400" />
                        <span>{log.task?.area || 'General Area'}</span>
                      </span>
                    </td>

                    {/* Date, Time & Frequency */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col text-xs gap-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {formatDate(log.createdAt)}
                        </span>
                        <span className="font-semibold text-slate-600 flex items-center gap-1 dark:text-slate-300">
                          <Clock size={12} className="text-slate-400 dark:text-slate-400" />
                          {formatTo12Hour(log.task?.startTime)} - {formatTo12Hour(log.task?.endTime)}
                        </span>
                        <span className="text-slate-400 text-[11px] capitalize dark:text-slate-400">
                          {log.task?.frequency || 'Daily'}
                        </span>
                      </div>
                    </td>



                    {/* Status Badge */}
                    <td className="py-4 px-4 md:pr-6 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-4 px-4 md:pr-6 whitespace-nowrap">
                      <VerificationBadge status={log.verificationStatus} />
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
        <div className="bg-white border-t border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between dark:bg-slate-900 dark:border-slate-700">
          <p className="text-xs text-slate-500 font-medium dark:text-slate-300">
            Page <span className="text-slate-900 font-bold dark:text-slate-100">{currentPage}</span> of{' '}
            <span className="text-slate-900 font-bold dark:text-slate-100">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
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