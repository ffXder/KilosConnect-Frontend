import React from "react";
import { Search, Plus } from "lucide-react";

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
    <div className="bg-white p-8 rounded-[24px] border border-[#e2e8f0] shadow-sm space-y-7 font-sans">
      
      {/* Primary Action Row: Search & Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search items by name, description, or found by..."
            className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#113129]/5 focus:border-[#113129] transition-all placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={onAddItem}
          className="bg-[#113129] text-white px-7 py-4 rounded-[16px] text-[15px] font-bold flex items-center gap-2 hover:bg-[#0a211b] transition-all shadow-[0_4px_12px_rgba(17,49,41,0.15)] active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Secondary Filter Row: Status & Area */}
      <div className="space-y-5">
        <div className="flex items-center gap-6">
          {/* Status Group */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest">Status:</span>
            <div className="flex bg-[#f1f5f9] p-1 rounded-[12px]">
              {["All", "Unclaimed", "Claimed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab as any)}
                  className={`px-5 py-2 rounded-[9px] text-[13px] font-bold transition-all ${
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

          <div className="h-6 w-px bg-gray-200" /> {/* Divider */}

          {/* Area Group */}
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest whitespace-nowrap">Area:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setZoneFilter(zone)}
                  className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold whitespace-nowrap border transition-all ${
                    zoneFilter === zone
                      ? "bg-[#113129] border-[#113129] text-white shadow-sm"
                      : "bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:bg-gray-50"
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LostAndFoundFilters;