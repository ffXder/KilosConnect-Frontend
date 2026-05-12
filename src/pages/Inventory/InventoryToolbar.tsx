import React from "react";
import { Search, Filter, MapPin, ChevronDown, Plus, Package, Wrench, LayoutGrid } from "lucide-react";

interface Props {
  activeInventory: string;
  setActiveInventory: (cat: any) => void;
  filter: string;
  setFilter: (f: any) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedArea: string;
  setSelectedArea: (area: any) => void;
  selectedAssetArea: string;
  setSelectedAssetArea: (area: string) => void;
  selectedCondition: string;
  setSelectedCondition: (condition: string) => void;
  onAddItem: () => void;
}

const tabs = [
  { label: "All Items", value: "All", icon: <LayoutGrid size={14} /> },
  { label: "Consumables", value: "Consumables", icon: <Package size={14} /> },
  { label: "Assets", value: "Assets", icon: <Wrench size={14} /> },
];

export const InventoryToolbar: React.FC<Props> = ({
  activeInventory, setActiveInventory, filter, setFilter, searchQuery, setSearchQuery,
  onAddItem, selectedArea, setSelectedArea, selectedAssetArea, setSelectedAssetArea,
  selectedCondition, setSelectedCondition
}) => {
  const assetZones = ["All Areas", "Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Weightlifting Area"];
  const assetConditions = ["All Conditions", "Good Condition", "Needs Repair", "Needs Replacement", "Under Repair"];

  return (
    <div className="space-y-4 mb-6">
      {/* Row 1: Tabs + Filters + Add Button */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        
        {/* Inventory Types Tabs */}
        <div className="flex gap-1 bg-[#f4f5f6] p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveInventory(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeInventory === tab.value
                  ? "bg-[#0a2e27] text-white shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Consumables Filters */}
          {activeInventory === "Consumables" && (
            <>
              {/* Category Dropdown */}
              {/* <div className="relative">
                  <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#e8e8e8] rounded-xl text-[11px] font-bold text-gray-600 cursor-pointer focus:outline-none focus:border-[#0a2e27] transition-colors"
                  >
                      {["ALL CATEGORIES", "General Storage", "Maintenance Storage"].map(cat => (
                          <option key={cat} value={cat}>
                              {cat === "ALL CATEGORIES" ? "All Categories" : cat}
                          </option>
                      ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div> */}

              {/* Area Dropdown */}
              <div className="relative">
                  <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#e8e8e8] rounded-xl text-[11px] font-bold text-gray-600 cursor-pointer focus:outline-none focus:border-[#0a2e27] transition-colors"
                  >
                    <option value="All Areas">All Areas</option>
                    <option value="General Storage">General Storage</option>
                    <option value="Maintenance Storage">Maintenance Storage</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Stock Status Dropdown */}
              <div className="relative">
                  <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#e8e8e8] rounded-xl text-[11px] font-bold text-gray-600 cursor-pointer focus:outline-none focus:border-[#0a2e27] transition-colors"
                  >
                      {[
                          { label: "All Stock", value: "ALL" },
                          { label: "Low Stock", value: "LOW STOCK" },
                          { label: "Out of Stock", value: "OUT OF STOCK" },
                      ].map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </>
          )}

          {/* Asset Filters */}
          {activeInventory === "Assets" && (
            <>
              <div className="relative">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#e8e8e8] rounded-xl text-[11px] font-bold text-gray-600 cursor-pointer focus:outline-none focus:border-[#0a2e27] transition-colors"
                >
                  {assetConditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedAssetArea}
                  onChange={(e) => setSelectedAssetArea(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#e8e8e8] rounded-xl text-[11px] font-bold text-gray-600 cursor-pointer focus:outline-none focus:border-[#0a2e27] transition-colors"
                >
                  {assetZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </>
          )}

          {/* Add Button */}
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 bg-[#0a2e27] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-[#08241f] active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Item
          </button>
        </div>
      </div>

      {/* Row 2: Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input
          className="w-full pl-12 pr-5 py-3 rounded-xl border border-[#e8e8e8] bg-[#fafafa] text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#0a2e27] focus:bg-white transition-all"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};