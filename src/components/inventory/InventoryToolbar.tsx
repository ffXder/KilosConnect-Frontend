import React from "react";
import { Filter, MapPin, Search } from "lucide-react";
import type { ActiveCategory, StockFilter } from "../../types/inventory";

interface Props {
  activeCategory: ActiveCategory;
  setActiveCategory: (cat: ActiveCategory) => void;
  filter: StockFilter;
  setFilter: (f: StockFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddItem: () => void;
}

const TABS = [
  { label: "All Items", value: "All" },
  { label: "Consumables", value: "Consumables" },
  { label: "Assets", value: "Assets" },
] as const;

const STOCK_FILTERS: StockFilter[] = ["ALL", "LOW STOCK", "OUT OF STOCK"];

export const InventoryToolbar: React.FC<Props> = ({
  activeCategory,
  setActiveCategory,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onAddItem,
}) => {
  return (
    <>
      {/* Tabs + Filter Row */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 bg-[#f4f5f6] p-1.5 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value as ActiveCategory)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeCategory === tab.value
                  ? "bg-[#0a2e27] text-white shadow-lg"
                  : "text-[#6b6b6b] hover:text-[#1f1f1f]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {activeCategory === "Consumables" && (
            <div className="flex items-center bg-[#f4f5f6] p-1 rounded-xl">
              {STOCK_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${
                    filter === f ? "bg-white text-[#1f1f1f] shadow-sm" : "text-gray-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          {activeCategory === "Assets" && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black">
                <Filter size={14} /> ALL CONDITIONS
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black">
                <MapPin size={14} /> ALL AREAS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search + Add Row */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[#0a2e27]/10"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={onAddItem}
          className="bg-[#0a2e27] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#08241f] transition-all shadow-md"
        >
          <span className="text-2xl">+</span> Add Item
        </button>
      </div>
    </>
  );
};