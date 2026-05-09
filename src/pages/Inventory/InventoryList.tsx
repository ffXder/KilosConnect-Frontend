import React from "react";
import { Layers, Trash2, Wrench, CalendarDays } from "lucide-react";

interface Props {
  activeCategory: string;
  filteredConsumables: any[];
  filteredAssets: any[];
  isOutOfStock: (item: any) => boolean;
  isLowStock: (item: any) => boolean;
  onAssetClick: (asset: any) => void; 
  onConsumableClick: (item: any) => void; 
  onDeleteConsumable: (id: string) => void;
  onDeleteAsset: (id: string) => void;
}

export const InventoryList: React.FC<Props> = ({ 
  activeCategory, 
  filteredConsumables, 
  filteredAssets, 
  isOutOfStock, 
  isLowStock,
  onAssetClick,
  onConsumableClick,
  onDeleteConsumable,
  onDeleteAsset
}) => {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {/* Consumables Rendering */}
      {(activeCategory === "Consumables" || activeCategory === "All") && filteredConsumables.map(item => (
        <div 
          key={item._id || item.consumableId} 
          onClick={() => onConsumableClick(item)} 
          className={`flex items-center justify-between p-6 bg-white border-2 rounded-2xl group transition-all cursor-pointer hover:bg-gray-50 active:scale-[0.99] ${isOutOfStock(item) ? "border-[#ff1a1a]" : isLowStock(item) ? "border-[#ff9900]" : "border-[#e8e8e8]"}`}
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#f4f5f6] text-gray-400 group-hover:bg-[#0a2e27] group-hover:text-white transition-colors">
              <Layers size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-bold text-[#1f1f1f]">{item.name}</h4>
                {isLowStock(item) && <span className="px-2 py-0.5 bg-[#fff7ed] text-[#ff9900] text-[10px] font-black rounded-md uppercase">Low Stock</span>}
                {isOutOfStock(item) && <span className="px-2 py-0.5 bg-[#fef2f2] text-[#ff1a1a] text-[10px] font-black rounded-md uppercase">Out of Stock</span>}
              </div>
              <div className="flex flex-col gap-1 mt-0.5">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-tight">ID: {item.consumableId} • {item.location || item.zone}</p>
                
                {item.lastRestocked && item.lastRestocked !== "" && item.lastRestocked !== item.createdAt && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0d9488] bg-[#f0fdfa] w-fit px-2 py-1 rounded-md mt-1 border border-[#ccfbf1]">
                    <CalendarDays size={12} />
                    <span>LAST RESTOCKED: {item.lastRestocked}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex items-center gap-8">
            <div>
              <div className={`text-[32px] font-black leading-none ${isOutOfStock(item) ? "text-[#ff1a1a]" : isLowStock(item) ? "text-[#ff9900]" : "text-[#1f1f1f]"}`}>{item.quantity}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase">{item.unit}</div>
            </div>
            {activeCategory !== "All" && (
              <button 
                className="text-gray-300 hover:text-red-500 transition-colors relative z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConsumable(item.consumableId);
                }}
              >
                <Trash2 size={22} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Assets Rendering */}
      {(activeCategory === "Assets" || activeCategory === "All") && filteredAssets.map(asset => (
        <div 
          key={asset._id || asset.assetId} 
          onClick={() => onAssetClick(asset)}
          className={`flex items-center justify-between p-6 bg-white border-2 rounded-2xl group transition-all cursor-pointer hover:bg-gray-50 active:scale-[0.99] ${
            asset.condition === "Needs Replacement" ? "border-[#ff1a1a]" : 
            asset.condition === "Good Condition" ? "border-[#10b981]" : 
            asset.condition === "Needs Repair" ? "border-[#ff9900]" : 
            asset.condition === "Under Repair" ? "border-[#3b82f6]" :
            "border-[#e8e8e8]"
          }`}
        >
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-[#f4f5f6] transition-colors group-hover:bg-[#0a2e27] group-hover:text-white ${
              asset.condition === "Good Condition" ? "text-[#10b981]" : "text-gray-400"
            }`}>
              <Wrench size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#1f1f1f] group-hover:text-[#0a2e27] transition-colors">{asset.name}</h4>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-tight">ID: {asset.assetId} • {asset.area || asset.zone}</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase ${
              asset.condition === "Good Condition" ? "bg-[#ecfdf5] text-[#10b981]" : 
              asset.condition === "Need Repair" ? "bg-[#fff7ed] text-[#ff9900]" : 
              asset.condition === "Needs Replacement" ? "bg-[#fef2f2] text-[#ff1a1a]" : "bg-blue-50 text-blue-500"
            }`}>
              {asset.condition || "New"}
            </span>
            {activeCategory !== "All" && (
              <button 
                className="text-gray-300 hover:text-red-500 transition-colors relative z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAsset(asset.assetId);
                }}
              >
                <Trash2 size={22} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};