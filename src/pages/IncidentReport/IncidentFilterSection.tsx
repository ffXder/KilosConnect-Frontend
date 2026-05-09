import React from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';

interface IncidentFilterSectionProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
  activeSeverity: string;
  onSeverityChange: (severity: string) => void;
  activeArea: string;
  onAreaChange: (location: string) => void;
  searchTerm: string; 
  onSearchChange: (val: string) => void; 
  onAddClick: () => void;
}

const IncidentFilterSection: React.FC<IncidentFilterSectionProps> = ({ 
  activeStatus, 
  onStatusChange,
  activeSeverity,
  onSeverityChange,
  activeArea,
  onAreaChange,
  searchTerm,
  onSearchChange,
  onAddClick 
}) => {
  // Added 'Archived' to statusOptions
  const statusOptions = ['All', 'Open', 'In Progress', 'Resolved'];
  const severityOptions = ['Any Severity', 'Low', 'Medium', 'High', 'Urgent', 'Critical'];
  const area = [
    'All Areas', 'Mezzanine', 'Powerlifting Area', 'Open WOD Area', 
    'CrossFit Area', 'Café', 'General Storage', 'Maintenance Storage'
  ];

  return (
    <div className="bg-white p-8 rounded-[24px] border border-[#e2e8f0] shadow-sm space-y-7 font-sans">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search incident title or description..."
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

      {/* Secondary Filter Row: Status, Priority, & Area */}
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

        {/* Priority Group */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Priority:</span>
          <div className="flex bg-[#f1f5f9] p-1 rounded-[12px] gap-1">
            {severityOptions.map((severity) => (
              <button
                key={severity}
                onClick={() => onSeverityChange(severity)}
                className={`px-4 py-2 rounded-[9px] text-[11px] font-bold transition-all ${
                  activeSeverity === severity
                    ? "bg-white text-[#113129] shadow-sm"
                    : "text-[#64748b] hover:text-[#1a1a1a]"
                }`}
              >
                {severity.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Area Group - Updated to Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Area:</span>
          <div className="relative">
            <select
              value={activeArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[13px] font-bold py-2.5 pl-4 pr-10 rounded-[12px] focus:outline-none focus:border-[#113129] focus:ring-1 focus:ring-[#113129] transition-all cursor-pointer hover:border-[#cbd5e1]"
            >
              {area.map((area) => (
                <option key={area} value={area}>
                  {area}
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

export default IncidentFilterSection;