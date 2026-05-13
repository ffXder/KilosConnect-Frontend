import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface Props {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  dateRange: string;      // New: Receives the selected date label
  setDateRange: (range: string) => void; // New: Function to change the date
}

export const LogsFilterSection: React.FC<Props> = ({ activeFilter, setActiveFilter, dateRange, setDateRange }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);


  const filters = ['All Logs', 'Inventory', 'Tasks', 'Incidents', 'Lost & Found'];
  const quickRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      
      {/* Scrollable Filters Container */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-1 px-1">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200
                ${isActive
                  ? 'bg-[#1a3d3a] text-white shadow-sm'
                  : 'bg-[#f1f4f9] text-[#7d8da1] hover:bg-[#e2e8f0]'
                }
              `}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Date Picker - Full width on mobile, auto width on desktop */}
      <div className="relative md:ml-auto">
        <button 
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className={`
            w-full md:w-auto flex items-center justify-between md:justify-start gap-3 px-4 py-2 rounded-xl border transition-all duration-200
            ${isDatePickerOpen 
              ? 'border-[#1a3d3a] bg-white shadow-md' 
              : 'border-gray-100 bg-[#f1f4f9] hover:bg-[#e2e8f0]'}
          `}
        >
          <div className="flex items-center gap-3">
            <Calendar size={18} className={isDatePickerOpen ? 'text-[#1a3d3a]' : 'text-[#7d8da1]'} />
            <span className="text-sm font-bold text-[#4d5d6d]">{dateRange}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDatePickerOpen && (
          <>
            {/* Mobile Backdrop: Closes menu when clicking outside */}
            <div 
              className="fixed inset-0 z-40 md:hidden" 
              onClick={() => setIsDatePickerOpen(false)} 
            />
            
            <div className="absolute right-0 mt-2 w-full md:w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2">
                {quickRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsDatePickerOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 md:py-2.5 text-sm font-semibold text-[#7d8da1] hover:bg-[#f1f4f9] hover:text-[#1a3d3a] rounded-lg transition-colors"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};