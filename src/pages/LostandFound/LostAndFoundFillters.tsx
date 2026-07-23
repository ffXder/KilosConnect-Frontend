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
    <div className="bg-white p-3 sm:p-5 rounded-[12px] sm:rounded-[20px] border border-[#e2e8f0] shadow-sm space-y-3 sm:space-y-5 font-sans">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[12px] sm:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#113129]/5 focus:border-[#113129] transition-all placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={onAddItem}
          className="bg-[#113129] text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-[8px] text-[12px] sm:text-[14px] font-bold flex items-center gap-1.5 hover:bg-[#0a211b] transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">New Item</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      {/* Secondary Filter Row: Status & Area */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        
        {/* Status Group */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] sm:text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Status:</span>
          <div className="flex bg-[#f1f5f9] p-0.5 rounded-[8px]">
            {(["All", "Unclaimed", "Claimed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-[6px] text-[10px] sm:text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab
                    ? "bg-white text-[#113129] shadow-sm"
                    : "text-[#64748b] hover:text-[#1a1a1a]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 sm:h-5 w-px bg-gray-200 shrink-0" />

        {/* Area Group - Dropdown Implementation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] sm:text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Area:</span>
          <div className="relative">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1e293b] text-[11px] sm:text-[13px] font-bold py-1.5 sm:py-2 pl-2 sm:pl-3 pr-6 sm:pr-8 rounded-[8px] focus:outline-none focus:border-[#113129] focus:ring-1 focus:ring-[#113129] transition-all cursor-pointer hover:border-[#cbd5e1] max-w-[100px] sm:max-w-none"
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2 pointer-events-none text-[#94a3b8]">
              <ChevronDown size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
