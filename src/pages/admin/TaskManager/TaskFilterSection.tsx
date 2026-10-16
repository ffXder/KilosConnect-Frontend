import React from 'react';
import { Plus, Search, ChevronDown, ArrowDown, ArrowUp } from 'lucide-react';

export type TaskSortField = 'date' | 'name' | 'day';
export type SortDirection = 'asc' | 'desc';

interface TaskFilterProps {
  onAddTask?: () => void; // Made optional to fix the TypeScript error
  onGenerate?: () => void;
  showAddButton?: boolean;
  showGenerateButton?: boolean;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  frequencyFilter: string;
  setFrequencyFilter: (val: string) => void;
  areaFilter: string;
  setAreaFilter: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: TaskSortField;
  setSortBy: (val: TaskSortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (val: SortDirection) => void;
  hideStatus?: boolean;
}

const TaskFilterSection: React.FC<TaskFilterProps> = ({ 
  onAddTask, 
  onGenerate,
  statusFilter, 
  setStatusFilter, 
  frequencyFilter, 
  setFrequencyFilter, 
  areaFilter, 
  setAreaFilter, 
  searchTerm, 
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  hideStatus = false,
}) => {
  const statusOptions = [
    { label: 'All Tasks', value: 'All Tasks', active: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50', inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100' },
    { label: 'Pending', value: 'Pending', active: 'bg-orange-500 text-white shadow-sm', inactive: 'text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200' },
    { label: 'Completed', value: 'Completed', active: 'bg-emerald-500 text-white shadow-sm', inactive: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200' },
  ];
  const zones = ["All Areas", "Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Weightlifting Area", "General Storage", "Maintenance Storage", "Multiple Area", "Front Desk Area", "Outdoor Area", "CR" , "1st Floor", "2nd Floor"];

  const frequencyOptions = [
    { 
      label: 'All', 
      active: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50', 
      inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200' 
    },
    { 
      label: 'Daily', 
      active: 'bg-purple-500 text-white dark:bg-purple-500 dark:text-white', 
      inactive: 'text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/40' 
    },
    { 
      label: 'Weekly', 
      active: 'bg-blue-500 text-white dark:bg-blue-500 dark:text-white', 
      inactive: 'text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40' 
    },
    { 
      label: 'Monthly', 
      active: 'bg-green-600 text-white dark:bg-green-600 dark:text-white', 
      inactive: 'text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-950/40' 
    }
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none transition-color duration-300">
      
      {/* Searchbar and Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full h-10 pl-9 pr-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4058]/5 focus:border-[#0B4058] transition-all placeholder:text-gray-400 dark:bg-slate-800 transition-color duration-300 dark:border-slate-600 dark:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={onAddTask}
          className="bg-[#0B4058] text-white h-10 px-4 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#062F41] transition-all shadow-sm active:scale-95 whitespace-nowrap dark:bg-[#126F91] dark:hover:bg-[#062F41]"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>

      {/* Secondary Filter Row: Status, Type, & Area */}
      <div className="flex flex-wrap items-center gap-6">
        {!hideStatus && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Status:</span>
              <div className="relative flex bg-[#f1f5f9] p-1 rounded-[12px] gap-1 dark:bg-slate-800">
                {statusOptions.map((status) => {
                  const isActive = statusFilter === status.value;
                  return (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value)}
                      className={`relative z-10 px-4 py-2 rounded-[9px] text-[12px] font-bold transition-all duration-300 cursor-pointer ${
                        isActive ? status.active : status.inactive
                      }`}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200" />
          </>
        )}

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Type:</span>
          <div className="flex bg-[#f1f5f9] p-1 rounded-[12px] gap-1 dark:bg-slate-800 dark:border-slate-600 transition-colors duration-300">
            {frequencyOptions.map((opt) => (
              <button 
                key={opt.label} 
                onClick={() => setFrequencyFilter(opt.label)}
                className={`px-3 py-2 rounded-[9px] text-[11px] font-bold transition-all cursor-pointer ${
                  frequencyFilter === opt.label 
                    ? opt.active + " shadow-sm" 
                    : opt.inactive
                }`}
              >
                {opt.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Area:</span>
          <div className="relative">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[13px] py-2.5 pl-4 pr-10 rounded-[12px] focus:outline-none focus:border-[#0B4058] focus:ring-1 focus:ring-[#0B4058] transition-all cursor-pointer hover:border-[#cbd5e1] dark:bg-slate-800 dark:border-slate-600 transition-color duration-300 dark:text-slate-300"
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#94a3b8]">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-600" />

        <div className="flex items-center gap-3">
          <label htmlFor="task-sort-by" className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="task-sort-by"
              aria-label="Sort tasks by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TaskSortField)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[13px] py-2.5 pl-4 pr-10 rounded-[12px] focus:outline-none focus:border-[#0B4058] focus:ring-1 focus:ring-[#0B4058] transition-all cursor-pointer hover:border-[#cbd5e1] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="day">Day</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#94a3b8]">
              <ChevronDown size={16} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'} (currently ${sortDirection === 'asc' ? 'ascending' : 'descending'})`}
            title={`Currently ${sortDirection === 'asc' ? 'ascending' : 'descending'}; click to sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            className="flex items-center justify-center border border-[#e2e8f0] bg-white text-[#1e293b] p-2.5 rounded-[12px] hover:border-[#cbd5e1] focus:outline-none focus:ring-1 focus:ring-[#0B4058] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
          >
            {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterSection;