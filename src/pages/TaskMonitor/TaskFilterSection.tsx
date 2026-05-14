import React from 'react';
import { Plus, Search, ChevronDown, Layers} from 'lucide-react';

interface TaskFilterProps {
  onAddTask: () => void;
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
  hideStatus?: boolean; // Added this optional prop to fix the error
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
  hideStatus = false, // Default to false
  showAddButton = false,
  showGenerateButton = false
}) => {
  const statusOptions = ['All Tasks', 'Pending', 'Completed'];
  const zones = ["All Areas", "Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Weightlifting Area", "General Storage", "Maintenance Storage", "Multiple Area", "Front Desk Area", "Outdoor Area", "CR" , "1st Floor", "2nd Floor"];
  
  const frequencyOptions = [
    { label: 'All', active: 'bg-[#a855f7] text-white', inactive: 'text-[#a855f7] bg-purple-50' },
    { label: 'Daily', active: 'bg-[#f5d0fe] text-[#a21caf]', inactive: 'text-[#a21caf] bg-[#fdf4ff]' },
    { label: 'Weekly', active: 'bg-[#dbeafe] text-[#1e40af]', inactive: 'text-[#1e40af] bg-[#eff6ff]' },
    { label: 'Monthly', active: 'bg-[#dcfce7] text-[#15803d]', inactive: 'text-[#15803d] bg-[#f0fdf4]' }
  ];

  return (
    <div className="bg-white p-8 rounded-[24px] border border-[#e2e8f0] shadow-sm space-y-7 font-sans">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#113129]/5 focus:border-[#113129] transition-all placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {showAddButton && (
          <button
            onClick={onAddTask}
            className="bg-[#113129] text-white px-7 py-4 rounded-[16px] text-[15px] font-bold flex items-center gap-2 hover:bg-[#0a211b] transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        )}

        {/* Only shows in "Live Monitor" tab */}
        {showGenerateButton && (
          <button
            onClick={onGenerate}
            className="bg-[#d86125] text-[#FDFFE0] px-7 py-4 rounded-[16px] text-[15px] font-bold flex items-center gap-2 hover:transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Layers size={20} strokeWidth={2.5} />
            <span>Initialize Today</span>
          </button>
        )}
      </div>

      {/* Secondary Filter Row: Status, Type, & Area */}
      <div className="flex flex-wrap items-center gap-6">
        
        {/* Status Group - Conditionally hidden for Admin "Manage" view */}
        {!hideStatus && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Status:</span>
              <div className="flex bg-[#f1f5f9] p-1 rounded-[12px]">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-5 py-2 rounded-[9px] text-[13px] font-bold transition-all cursor-pointer ${
                      statusFilter === status
                        ? "bg-white text-[#113129] shadow-sm"
                        : "text-[#64748b] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200" />
          </>
        )}

        {/* Type (Frequency) Group */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Type:</span>
          <div className="flex bg-[#f1f5f9] p-1 rounded-[12px] gap-1">
            {frequencyOptions.map((opt) => (
              <button 
                key={opt.label} 
                onClick={() => setFrequencyFilter(opt.label)}
                className={`px-4 py-2 rounded-[9px] font-semibold text-[10px] transition-all cursor-pointer ${
                  frequencyFilter === opt.label 
                    ? opt.active + " shadow-sm" 
                    : "text-slate-400 hover:bg-white/50"  
                }`}
              >
                {opt.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Area Group */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Area:</span>
          <div className="relative">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[13px] font-bold py-2.5 pl-4 pr-10 rounded-[12px] focus:outline-none focus:border-[#113129] focus:ring-1 focus:ring-[#113129] transition-all cursor-pointer hover:border-[#cbd5e1]"
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
      </div>
    </div>
  );
};

export default TaskFilterSection;