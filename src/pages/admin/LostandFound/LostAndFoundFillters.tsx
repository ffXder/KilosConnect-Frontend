import React from "react";
import { Search, Plus, ChevronDown } from "lucide-react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "All" | "Unclaimed" | "Claimed";
  setStatusFilter: (filter: "All" | "Unclaimed" | "Claimed") => void;
  zoneFilter: string;
  setZoneFilter: (zone: string) => void;
  zones: string[];
  onAddItem: () => void;
}

export const LostAndFoundFilters: React.FC<FilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  zoneFilter,
  setZoneFilter,
  zones,
  onAddItem,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4 font-sans dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search items by name, description, or found by..."
            className="w-full h-10 pl-9 pr-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113129]/5 focus:border-[#113129] transition-all placeholder:text-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={onAddItem}
          className="bg-[#113129] text-white h-10 px-4 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0a211b] transition-all shadow-[0_4px_12px_rgba(17,49,41,0.15)] active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Item</span>
        </button>
      </div>

      {/* Secondary Filter Row: Status & Area */}
      <div className="flex flex-wrap items-center gap-6">
        
        {/* Status Group */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Status:</span>
          <div className="relative flex bg-[#f1f5f9] p-1 rounded-[12px] gap-1 dark:bg-slate-800">
            {([
              { label: 'All', value: 'All', active: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50', inactive: 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100' },
              { label: 'Unclaimed', value: 'Unclaimed', active: 'bg-orange-500 text-white shadow-sm', inactive: 'text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200' },
              { label: 'Claimed', value: 'Claimed', active: 'bg-emerald-500 text-white shadow-sm', inactive: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200' },
            ] as const).map((tab) => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`relative z-10 px-4 py-2 rounded-[9px] text-[12px] font-bold transition-all duration-300 ${
                    isActive ? tab.active : tab.inactive
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" /> {/* Divider */}

        {/* Area Group - Dropdown Implementation */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Area:</span>
          <div className="relative">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[13px] font-bold py-2.5 pl-4 pr-10 rounded-[12px] focus:outline-none focus:border-[#113129] focus:ring-1 focus:ring-[#113129] transition-all cursor-pointer hover:border-[#cbd5e1] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
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