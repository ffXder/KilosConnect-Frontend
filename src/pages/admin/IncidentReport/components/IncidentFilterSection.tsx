import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, Calendar, RotateCcw } from 'lucide-react';

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
  dateRange: string;
  setDateRange: (range: string) => void;
  customStart: string;
  setCustomStart: (d: string) => void;
  customEnd: string;
  setCustomEnd: (d: string) => void;
  onResetFilters?: () => void;
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
  onAddClick,
  dateRange,
  setDateRange,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  onResetFilters,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Sync external search updates into local state
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Debounce search update to avoid spamming URL search params
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, searchTerm, onSearchChange]);

  const statusOptions = [
    { label: 'All', value: 'All', active: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50', inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100' },
    { label: 'Open', value: 'Open', active: 'bg-sky-500 text-white shadow-sm', inactive: 'text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200' },
    { label: 'In Progress', value: 'In Progress', active: 'bg-blue-500 text-white shadow-sm', inactive: 'text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200' },
    { label: 'Resolved', value: 'Resolved', active: 'bg-emerald-500 text-white shadow-sm', inactive: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200' },
  ];
  const severityOptions = [
    { label: 'Any Severity', value: 'Any Severity', active: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50', inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100' },
    { label: 'Low', value: 'Low', active: 'bg-blue-500 text-white shadow-sm', inactive: 'text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200' },
    { label: 'Medium', value: 'Medium', active: 'bg-amber-400 text-slate-900 shadow-sm', inactive: 'text-amber-600 hover:text-amber-700 dark:text-yellow-300 dark:hover:text-yellow-200' },
    { label: 'High', value: 'High', active: 'bg-orange-500 text-white shadow-sm', inactive: 'text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200' },
    { label: 'Urgent', value: 'Urgent', active: 'bg-red-500 text-white shadow-sm', inactive: 'text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200' },
    { label: 'Critical', value: 'Critical', active: 'bg-violet-500 text-white shadow-sm', inactive: 'text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200' },
  ];
  const areaOptions = [
    'All Areas',
    'Mezzanine',
    'Powerlifting Area',
    'Open WOD Area',
    'CrossFit Area',
    'Café',
    'General Storage',
    'Maintenance Storage',
  ];
  const quickRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  const isFiltered =
    activeStatus !== 'All' ||
    activeSeverity !== 'Any Severity' ||
    activeArea !== 'All Areas' ||
    searchTerm !== '' ||
    dateRange !== 'Last 30 Days' ||
    customStart !== '' ||
    customEnd !== '';

  const handleReset = () => {
    setLocalSearch(''); 
    if (onResetFilters) {
      onResetFilters()
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] flex flex-col gap-3 font-sans shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
      {/* Row 1: Search + Date Picker + Action */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search incident title or description..."
            className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#113129] focus:bg-white placeholder:text-gray-400 transition-all dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-slate-500 dark:focus:bg-slate-800"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Date Picker Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className={`flex items-center gap-2 h-10 px-3 rounded-lg border text-sm font-medium transition-all ${
              isDatePickerOpen
                ? 'border-[#113129] bg-white shadow-md dark:border-slate-500 dark:bg-slate-800'
                : 'border-[#e2e8f0] bg-gray-50 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar size={15} className={isDatePickerOpen ? 'text-[#113129]' : 'text-gray-400 dark:text-slate-300'} />
            <span className="text-gray-700 whitespace-nowrap dark:text-slate-200">
              {dateRange === 'Custom Range' && customStart && customEnd
                ? `${customStart} → ${customEnd}`
                : dateRange}
            </span>
            <ChevronDown size={13} className={`transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDatePickerOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />
              <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
                <div className="p-2">
                  {quickRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setDateRange(range);
                        if (range !== 'Custom Range') setIsDatePickerOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
                        dateRange === range
                          ? 'bg-[#113129] text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#113129] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
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
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-[#113129]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={customEnd}
                          min={customStart}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-[#113129]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(false)}
                        disabled={!customStart || !customEnd}
                        className="w-full py-2 rounded-lg bg-[#113129] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                      >
                        Apply Filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Report Incident Action */}
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-2 h-10 px-4 bg-[#113129] text-white rounded-lg text-sm font-medium hover:bg-[#0a211b] transition-all whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={2.5} />
          Report incident
        </button>
      </div>

      {/* Row 2: Toggle Filters & Clear Button */}
      <div className="flex items-center gap-3 flex-wrap pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-400 dark:text-slate-400">Status</span>
          <div className="relative flex bg-gray-100 p-1 rounded-[10px] gap-1 dark:bg-slate-800">
            {statusOptions.map((option) => {
              const isActive = activeStatus === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onStatusChange(option.value)}
                  className={`relative z-10 px-3 py-2 rounded-[8px] text-[11px] font-semibold transition-all duration-300 ${
                    isActive ? option.active : option.inactive
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-4 w-px bg-gray-200 dark:bg-slate-600" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-400 dark:text-slate-400">Severity</span>
          <div className="relative flex flex-wrap bg-gray-100 p-1 rounded-[10px] gap-1 dark:bg-slate-800 max-w-full">
            {severityOptions.map((option) => {
              const isActive = activeSeverity === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSeverityChange(option.value)}
                  className={`relative z-10 px-3 py-2 rounded-[8px] text-[11px] font-semibold transition-all duration-300 ${
                    isActive ? option.active : option.inactive
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-4 w-px bg-gray-200 dark:bg-slate-600" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-400 dark:text-slate-400">Area</span>
          <div className="relative">
            <select
              value={activeArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-[#e2e8f0] text-[12px] font-medium text-gray-700 py-2 pl-3 pr-8 rounded-[8px] focus:outline-none focus:border-[#113129] cursor-pointer hover:bg-gray-100 transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {areaOptions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none dark:text-slate-300" />
          </div>
        </div>

        {isFiltered && (
          <>
            <div className="h-4 w-px bg-gray-200" />
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all ml-auto sm:ml-0"
              title="Reset all filter criteria"
            >
              <RotateCcw size={13} />
              Reset filters
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IncidentFilterSection;