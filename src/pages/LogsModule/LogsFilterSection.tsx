import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface Props {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  customStart: string;           // "YYYY-MM-DD" string from input
  setCustomStart: (d: string) => void;
  customEnd: string;
  setCustomEnd: (d: string) => void;
}

export const LogsFilterSection: React.FC<Props> = ({ 
  activeFilter, setActiveFilter, 
  dateRange, setDateRange,
  customStart, setCustomStart,
  customEnd, setCustomEnd
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const filters = ['All Logs', 'Inventory', 'Tasks', 'Incidents', 'Lost & Found'];
  const quickRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      
      {/* Module Filters */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-1 px-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-[#1a3d3a] text-white shadow-sm'
                : 'bg-[#f1f4f9] text-[#7d8da1] hover:bg-[#e2e8f0]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Date Picker */}
      <div className="relative md:ml-auto">
        <button
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className={`w-full md:w-auto flex items-center justify-between md:justify-start gap-3 px-4 py-2 rounded-xl border transition-all duration-200 ${
            isDatePickerOpen
              ? 'border-[#1a3d3a] bg-white shadow-md'
              : 'border-gray-100 bg-[#f1f4f9] hover:bg-[#e2e8f0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Calendar size={18} className={isDatePickerOpen ? 'text-[#1a3d3a]' : 'text-[#7d8da1]'} />
            <span className="text-sm font-bold text-[#4d5d6d]">
              {dateRange === 'Custom Range' && customStart && customEnd
                ? `${customStart} → ${customEnd}`
                : dateRange}
            </span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDatePickerOpen && (
          <>
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsDatePickerOpen(false)} />
            <div className="absolute right-0 mt-2 w-full md:w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-2">
                {quickRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      if (range !== 'Custom Range') setIsDatePickerOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                      dateRange === range
                        ? 'bg-[#1a3d3a] text-white'
                        : 'text-[#7d8da1] hover:bg-[#f1f4f9] hover:text-[#1a3d3a]'
                    }`}
                  >
                    {range}
                  </button>
                ))}

                {/* Custom Range Inputs — only shown when selected */}
                {dateRange === 'Custom Range' && (
                  <div className="mt-2 px-2 pb-2 flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-1 block">Start Date</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#1a3d3a]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-1 block">End Date</label>
                      <input
                        type="date"
                        value={customEnd}
                        min={customStart}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#1a3d3a]"
                      />
                    </div>
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      disabled={!customStart || !customEnd}
                      className="w-full py-2 rounded-xl bg-[#1a3d3a] text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed mt-1"
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
    </div>
  );
};