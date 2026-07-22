import React, { useState } from 'react';
import { Plus, Search, ChevronDown, Calendar } from 'lucide-react';

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
  // NEW
  dateRange: string;
  setDateRange: (range: string) => void;
  customStart: string;
  setCustomStart: (d: string) => void;
  customEnd: string;
  setCustomEnd: (d: string) => void;
}

const IncidentFilterSection: React.FC<IncidentFilterSectionProps> = ({ 
  activeStatus, onStatusChange,
  activeSeverity, onSeverityChange,
  activeArea, onAreaChange,
  searchTerm, onSearchChange,
  onAddClick,
  dateRange, setDateRange,
  customStart, setCustomStart,
  customEnd, setCustomEnd
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const statusOptions = ['All', 'Open', 'In Progress', 'Resolved'];
  const severityOptions = ['Any Severity', 'Low', 'Medium', 'High', 'Urgent', 'Critical'];
  const area = [
    'All Areas', 'Mezzanine', 'Powerlifting Area', 'Open WOD Area', 
    'CrossFit Area', 'Café', 'General Storage', 'Maintenance Storage'
  ];
  const quickRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  return (
    <div className="bg-white p-5 rounded-[16px] border border-[#e2e8f0] flex flex-col gap-3 font-sans">

      {/* Row 1: Search + Date Picker + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search incident title or description..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-[#e2e8f0] rounded-[8px] text-[13px] focus:outline-none focus:border-[#113129] placeholder:text-gray-400 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Date Picker */}
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] border text-[13px] font-medium transition-all ${
              isDatePickerOpen
                ? 'border-[#113129] bg-white shadow-md'
                : 'border-[#e2e8f0] bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <Calendar size={15} className={isDatePickerOpen ? 'text-[#113129]' : 'text-gray-400'} />
            <span className="text-gray-700 whitespace-nowrap">
              {dateRange === 'Custom Range' && customStart && customEnd
                ? `${customStart} → ${customEnd}`
                : dateRange}
            </span>
            <ChevronDown size={13} className={`transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDatePickerOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-2">
                  {quickRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        if (range !== 'Custom Range') setIsDatePickerOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-colors ${
                        dateRange === range
                          ? 'bg-[#113129] text-white'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-[#113129]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}

                  {dateRange === 'Custom Range' && (
                    <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-3 px-1">
                      <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#113129]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={customEnd}
                          min={customStart}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#113129]"
                        />
                      </div>
                      <button
                        onClick={() => setIsDatePickerOpen(false)}
                        disabled={!customStart || !customEnd}
                        className="w-full py-2 rounded-xl bg-[#113129] text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#113129] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#0a211b] transition-all whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={2.5} />
          Report incident
        </button>
      </div>

      {/* Row 2: Filters — unchanged */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] font-medium text-gray-400">Status</span>
        <div className="flex bg-gray-100 rounded-[8px] p-0.5 gap-0.5">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all ${
                activeStatus === s
                  ? 'bg-white text-[#113129] border border-[#e2e8f0]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200" />

        <span className="text-[11px] font-medium text-gray-400">Severity</span>
        <div className="relative">
          <select
            value={activeSeverity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-[#e2e8f0] text-[12px] font-medium text-gray-700 py-2 pl-3 pr-8 rounded-[8px] focus:outline-none focus:border-[#113129] cursor-pointer"
          >
            {severityOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="h-5 w-px bg-gray-200" />

        <span className="text-[11px] font-medium text-gray-400">Area</span>
        <div className="relative">
          <select
            value={activeArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-[#e2e8f0] text-[12px] font-medium text-gray-700 py-2 pl-3 pr-8 rounded-[8px] focus:outline-none focus:border-[#113129] cursor-pointer"
          >
            {area.map((a) => <option key={a}>{a}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default IncidentFilterSection;