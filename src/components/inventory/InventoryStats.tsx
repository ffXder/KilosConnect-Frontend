import React from "react";
import type { ActiveCategory } from "../../types/inventory";

interface Props {
  activeCategory: ActiveCategory;
  outOfStockCount: number;
  lowStockCount: number;
  totalCount: number;
}

export const InventoryStats: React.FC<Props> = ({
  activeCategory,
  outOfStockCount,
  lowStockCount,
  totalCount,
}) => {
  if (activeCategory === "Consumables") {
    return (
      <div className="flex gap-8 text-center uppercase tracking-wider">
        <div>
          <div className="text-[22px] font-black text-[#ff1a1a]">{outOfStockCount}</div>
          <div className="text-[10px] font-bold text-gray-400">Out of Stock</div>
        </div>
        <div>
          <div className="text-[22px] font-black text-[#ff9900]">{lowStockCount}</div>
          <div className="text-[10px] font-bold text-gray-400">Low Stock</div>
        </div>
      </div>
    );
  }

  if (activeCategory === "Assets") {
    return (
      <div className="flex gap-8 text-center uppercase tracking-wider">
        <div>
          <div className="text-[22px] font-black text-[#ff1a1a]">0</div>
          <div className="text-[10px] font-bold text-gray-400">Damaged</div>
        </div>
        <div>
          <div className="text-[22px] font-black text-[#ff9900]">1</div>
          <div className="text-[10px] font-bold text-gray-400">Need Repair</div>
        </div>
        <div>
          <div className="text-[22px] font-black text-[#3385ff]">1</div>
          <div className="text-[10px] font-bold text-gray-400">Under Repair</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8 text-center uppercase tracking-wider">
      <div>
        <div className="text-[22px] font-black text-[#1f1f1f]">{totalCount}</div>
        <div className="text-[10px] font-bold text-gray-400">Total Items</div>
      </div>
    </div>
  );
};