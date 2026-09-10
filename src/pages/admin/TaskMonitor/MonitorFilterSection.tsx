import React from 'react';
import { Plus, Search, ChevronDown, Layers} from 'lucide-react';

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
  hideStatus = false,
  showAddButton = false,
  showGenerateButton = false
}) => {
  const statusOptions = [
    { label: 'All Tasks', value: 'All Tasks', active: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50', inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100' },
    { label: 'Pending', value: 'Pending', active: 'bg-orange-500 text-white shadow-sm', inactive: 'text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200' },
    { label: 'Completed', value: 'Completed', active: 'bg-emerald-500 text-white shadow-sm', inactive: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200' },
  ];
  const zones = ["All Areas", "Mezzanine", "Powerlifting", "Open WOD", "CrossFit", "Weightlifting", "General Storage", "Maintenance Storage", "Multiple Area", "Front Desk Area", "Outdoor Area", "CR" , "1st Floor", "2nd Floor"];

  const frequencyOptions = [
    { label: 'All', active: 'bg-[#a855f7] text-white', inactive: 'text-[#a855f7] bg-purple-50' },
    { label: 'Daily', active: 'bg-[#f5d0fe] text-[#a21caf]', inactive: 'text-[#a21caf] bg-[#fdf4ff]' },
    { label: 'Weekly', active: 'bg-[#dbeafe] text-[#1e40af]', inactive: 'text-[#1e40af] bg-[#eff6ff]' },
    { label: 'Monthly', active: 'bg-[#dcfce7] text-[#15803d]', inactive: 'text-[#15803d] bg-[#f0fdf4]' }
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-700">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full h-10 pl-9 pr-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113129]/5 focus:border-[#113129] transition-all placeholder:text-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {showAddButton && onAddTask && (
          <button
            onClick={onAddTask}
            className="bg-[#113129] text-white h-10 px-4 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0a211b] transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        )}

        {/* Corrected: Label restored to "Initialize Today" */}
        {showGenerateButton && onGenerate && (
          <button
            onClick={onGenerate}
            className="bg-[#d86125] text-[#FDFFE0] h-10 px-4 rounded-lg text-sm font-bold flex items-center gap-2 hover:transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Layers size={16} strokeWidth={2.5} />
            <span>Initialize Today</span>
          </button>
        )}
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
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest dark:text-slate-300">Type:</span>
          <div className="flex bg-[#f1f5f9] p-1 rounded-[12px] gap-1 dark:bg-slate-800">
            {frequencyOptions.map((opt) => (
              <button 
                key={opt.label} 
                onClick={() => setFrequencyFilter(opt.label)}
                className={`px-4 py-2 rounded-[9px] font-semibold text-[10px] transition-all cursor-pointer ${
                  frequencyFilter === opt.label 
                    ? opt.active + " shadow-sm" 
                    : "text-slate-400 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-slate-700"  
                }`}
              >
                {opt.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-600" />

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap dark:text-slate-300">Area:</span>
          <div className="relative">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[13px] font-bold py-2.5 pl-4 pr-10 rounded-[12px] focus:outline-none focus:border-[#113129] focus:ring-1 focus:ring-[#113129] transition-all cursor-pointer hover:border-[#cbd5e1] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:hover:border-slate-500"
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#94a3b8] dark:text-slate-300">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterSection;