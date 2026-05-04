import React from "react";
import { Layers, Trash2 } from "lucide-react";
import type { InventoryItemData } from "../../types/inventory";

interface Props {
  item: InventoryItemData;
  isLowStock: boolean;
  isOutOfStock: boolean;
  onDelete?: (id: string) => void;
}

export const ConsumableCard: React.FC<Props> = ({ item, isLowStock, isOutOfStock, onDelete }) => {
  const borderColor = isOutOfStock
    ? "border-[#ff1a1a]"
    : isLowStock
    ? "border-[#ff9900]"
    : "border-[#e8e8e8]";

  const quantityColor = isOutOfStock
    ? "text-[#ff1a1a]"
    : isLowStock
    ? "text-[#ff9900]"
    : "text-[#1f1f1f]";

  return (
    <div className={`flex items-center justify-between p-6 bg-white border-2 rounded-2xl group hover:shadow-lg transition-all ${borderColor}`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#f4f5f6] text-gray-400 group-hover:bg-[#0a2e27] group-hover:text-white transition-colors">
          <Layers size={24} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="text-xl font-bold text-[#1f1f1f]">{item.name}</h4>
            {isLowStock && (
              <span className="px-2 py-0.5 bg-[#fff7ed] text-[#ff9900] text-[10px] font-black rounded-md uppercase">
                Low Stock
              </span>
            )}
            {isOutOfStock && (
              <span className="px-2 py-0.5 bg-[#fef2f2] text-[#ff1a1a] text-[10px] font-black rounded-md uppercase">
                Out of Stock
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-tight">
            ID: {item.consumableId} • Min: {item.lowStockAlert}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <div className={`text-[32px] font-black leading-none ${quantityColor}`}>{item.quantity}</div>
          <div className="text-[10px] font-black text-gray-400 uppercase">{item.unit}</div>
        </div>
        <button
          onClick={() => onDelete?.(item._id)}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
};