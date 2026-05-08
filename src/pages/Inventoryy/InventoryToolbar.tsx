import React from "react";
import { Search, Filter, MapPin, ChevronDown } from "lucide-react";

interface Props {
  activeCategory: string;
  setActiveCategory: (cat: any) => void;
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

export const InventoryToolbar: React.FC<Props> = ({ 
  activeCategory, setActiveCategory, filter, setFilter, searchQuery, setSearchQuery, 
  onAddItem, selectedArea, setSelectedArea, selectedAssetArea, setSelectedAssetArea,
  selectedCondition, setSelectedCondition
}) => {
  const assetZones = ["ALL AREAS", "Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Café"];
  const assetConditions = ["ALL CONDITIONS", "GOOD CONDITION", "NEED REPAIR", "NEEDS REPLACEMENT", "UNDER REPAIR"];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 bg-[#f4f5f6] p-1.5 rounded-xl">
          {["All Items", "Consumables", "Assets"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveCategory(tab.replace(" Items", ""))}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeCategory === tab.replace(" Items", "") ? "bg-[#0a2e27] text-white shadow-lg" : "text-[#6b6b6b]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {activeCategory === "Consumables" && (
            <div className="flex gap-3">
              <div className="flex items-center bg-[#f4f5f6] p-1 rounded-xl">
                {["General Storage", "Maintenance Storage"].map(area => (
                  <button key={area} onClick={() => setSelectedArea(area)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedArea === area ? "bg-[#0a2e27] text-white shadow-sm" : "text-gray-400"}`}>
                    {area.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-[#f4f5f6] p-1 rounded-xl">
                {["ALL", "LOW STOCK", "OUT OF STOCK"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${filter === f ? "bg-white text-[#1f1f1f] shadow-sm" : "text-gray-400"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "Assets" && (
            <div className="flex gap-3">
              <div className="relative">
                <select 
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black cursor-pointer focus:outline-none focus:border-[#0a2e27]"
                >
                  {assetConditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  value={selectedAssetArea}
                  onChange={(e) => setSelectedAssetArea(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black cursor-pointer focus:outline-none focus:border-[#0a2e27]"
                >
                  {assetZones.map(zone => <option key={zone} value={zone}>{zone.toUpperCase()}</option>)}
                </select>
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#e8e8e8] focus:outline-none" 
            placeholder="Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={onAddItem} className="bg-[#0a2e27] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:bg-[#08241f] transition-all">
          <span className="text-2xl">+</span> Add Item
        </button>
      </div>
    </>
  );
};