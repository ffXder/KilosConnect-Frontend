import React from 'react';
import { Plus, Search } from 'lucide-react';

interface IncidentFilterSectionProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
  activePriority: string;
  onPriorityChange: (priority: string) => void;
  activeLocation: string;
  onLocationChange: (location: string) => void;
  searchTerm: string; 
  onSearchChange: (val: string) => void; 
  onAddClick: () => void;
}

const IncidentFilterSection: React.FC<IncidentFilterSectionProps> = ({ 
  activeStatus, 
  onStatusChange,
  activePriority,
  onPriorityChange,
  activeLocation,
  onLocationChange,
  searchTerm,
  onSearchChange,
  onAddClick 
}) => {
  // Added 'Archived' to statusOptions[cite: 2]
  const statusOptions = ['All', 'Pending', 'In Progress', 'Resolved'];
  const priorityOptions = ['Any Priority', 'Low Severity', 'Medium Severity', 'High Severity'];
  const locations = [
    'All Areas', 'Mezzanine', 'Powerlifting Area', 'Open WOD Area', 
    'CrossFit Area', 'Café', 'General Storage', 'Maintenance Storage'
  ];

  return (
    <div className="bg-white p-8 rounded-[24px] border border-[#e2e8f0] shadow-sm space-y-7 font-sans mb-6">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search incidents..."
            className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#113129]/5 focus:border-[#113129] transition-all placeholder:text-gray-400"
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
        <button
          onClick={onAddClick}
          className="bg-[#113129] text-white px-7 py-4 rounded-[16px] text-[15px] font-bold flex items-center gap-2 hover:bg-[#0a211b] transition-all shadow-[0_4px_12px_rgba(17,49,41,0.15)] active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Secondary Filter Row: Status, Severity & Location */}
      <div className="flex flex-wrap items-center gap-6">
        
        {/* Status Group */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Status:</span>
          <div className="flex bg-[#f1f5f9] p-1 rounded-[12px]">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-5 py-2 rounded-[9px] text-[13px] font-bold transition-all ${
                  activeStatus === status
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

        {/* Severity Group */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Severity:</span>
          <div className="flex bg-[#f1f5f9] p-1 rounded-[12px]">
            {priorityOptions.map((priority) => (
              <button
                key={priority}
                onClick={() => onPriorityChange(priority)}
                className={`px-4 py-2 rounded-[9px] text-[11px] font-bold transition-all ${
                  activePriority === priority
                    ? "bg-white text-[#113129] shadow-sm"
                    : "text-[#64748b] hover:text-[#1a1a1a]"
                }`}
              >
                {priority.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Location Group */}
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Location:</span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => onLocationChange(loc)}
                className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold whitespace-nowrap border transition-all ${
                  activeLocation === loc
                    ? "bg-[#113129] border-[#113129] text-white shadow-sm"
                    : "bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:bg-gray-50"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentFilterSection;