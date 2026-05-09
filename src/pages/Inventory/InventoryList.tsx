import React, { useMemo } from "react";
import { Layers, Trash2, Wrench, Package} from "lucide-react";

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

const conditionStyles: Record<string, { border: string; badge: string; text: string }> = {
  "Working":            { border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-600", text: "Working" },
  "Needs Repair":       { border: "border-amber-200",   badge: "bg-amber-50 text-amber-600",     text: "Needs Repair" },
  "Needs Replacement":  { border: "border-red-200",     badge: "bg-red-50 text-red-500",         text: "Needs Replacement" },
  "Under Repair":       { border: "border-blue-200",    badge: "bg-blue-50 text-blue-500",       text: "Under Repair" },
  "Damaged":            { border: "border-red-400",     badge: "bg-red-100 text-red-600",        text: "Damaged" },
};

export const InventoryList: React.FC<Props> = ({
  activeCategory,
  filteredConsumables,
  filteredAssets,
  isOutOfStock,
  isLowStock,
  onAssetClick,
  onConsumableClick,
  onDeleteConsumable,
  onDeleteAsset,
}) => {

  // Merge and sort by createdAt for "All" view
  const allItems = useMemo(() => {
    if (activeCategory !== "All") return [];
    const consumablesTagged = filteredConsumables.map(i => ({ ...i, _type: "consumable" }));
    const assetsTagged = filteredAssets.map(a => ({ ...a, _type: "asset" }));
    return [...consumablesTagged, ...assetsTagged].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [activeCategory, filteredConsumables, filteredAssets]);

  const renderConsumable = (item: any, showDelete: boolean) => {
    const outOfStock = isOutOfStock(item);
    const lowStock = isLowStock(item);
    return (
      <div
        key={item.consumableId}
        onClick={() => onConsumableClick(item)}
        className={`group flex items-center justify-between px-6 py-4 bg-white border rounded-2xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px] active:scale-[0.99] ${
          outOfStock ? "border-red-300 bg-red-50/30" : lowStock ? "border-amber-300 bg-amber-50/30" : "border-[#e8e8e8]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
            outOfStock ? "bg-red-100 text-red-400" : lowStock ? "bg-amber-100 text-amber-500" : "bg-[#f4f5f6] text-gray-400 group-hover:bg-[#0a2e27] group-hover:text-white"
          }`}>
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#1f1f1f] text-base">{item.name}</h4>
              {lowStock && !outOfStock && <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-black rounded-md uppercase tracking-wide">Low Stock</span>}
              {outOfStock && <span className="px-2 py-0.5 bg-red-100 text-red-500 text-[10px] font-black rounded-md uppercase tracking-wide">Out of Stock</span>}
              <span className="px-2 py-0.5 bg-[#f0f9ff] text-[#0369a1] text-[10px] font-bold rounded-md">Consumable</span>
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-tight mt-0.5">
              {item.consumableId} • {item.location || item.zone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`text-2xl font-black leading-none ${outOfStock ? "text-red-500" : lowStock ? "text-amber-500" : "text-[#1f1f1f]"}`}>
              {item.quantity}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">{item.unit}</div>
          </div>
          {showDelete && (
            <button
              className="text-gray-300 hover:text-red-500 transition-colors"
              onClick={(e) => { e.stopPropagation(); onDeleteConsumable(item.consumableId); }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAsset = (asset: any, showDelete: boolean) => {
    const style = conditionStyles[asset.condition] ?? { border: "border-[#e8e8e8]", badge: "bg-gray-100 text-gray-500", text: asset.condition };
    return (
      <div
        key={asset.assetId}
        onClick={() => onAssetClick(asset)}
        className={`group flex items-center justify-between px-6 py-4 bg-white border rounded-2xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px] active:scale-[0.99] ${style.border}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#f4f5f6] text-gray-400 group-hover:bg-[#0a2e27] group-hover:text-white transition-colors">
            <Wrench size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#1f1f1f] text-base">{asset.name}</h4>
              <span className="px-2 py-0.5 bg-[#f5f0ff] text-[#7c3aed] text-[10px] font-bold rounded-md">Asset</span>
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-tight mt-0.5">
              {asset.assetId} • {asset.area || asset.zone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${style.badge}`}>
            {style.text}
          </span>
          {showDelete && (
            <button
              className="text-gray-300 hover:text-red-500 transition-colors"
              onClick={(e) => { e.stopPropagation(); onDeleteAsset(asset.assetId); }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
      {/* ALL — merged and sorted by recent */}
      {activeCategory === "All" && allItems.map(item =>
        item._type === "consumable"
          ? renderConsumable(item, false)
          : renderAsset(item, false)
      )}

      {/* CONSUMABLES only */}
      {activeCategory === "Consumables" && filteredConsumables.map(item => renderConsumable(item, true))}

      {/* ASSETS only */}
      {activeCategory === "Assets" && filteredAssets.map(asset => renderAsset(asset, true))}

      {/* Empty state */}
      {((activeCategory === "All" && allItems.length === 0) ||
        (activeCategory === "Consumables" && filteredConsumables.length === 0) ||
        (activeCategory === "Assets" && filteredAssets.length === 0)) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="text-gray-200 mb-3" size={40} />
          <p className="text-gray-400 font-semibold">No items found</p>
          <p className="text-gray-300 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};