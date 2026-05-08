import React from "react";

interface Props {
  activeCategory: string;
  outOfStockCount: number;
  lowStockCount: number;
  totalItems: number;
  goodConditionCount: number;
  needRepairCount: number;
  needsReplacementCount: number;
  underRepairCount: number;
}

export const InventoryStats: React.FC<Props> = ({ 
  activeCategory, 
  outOfStockCount, 
  lowStockCount, 
  totalItems,
  goodConditionCount,
  needRepairCount,
  needsReplacementCount,
  underRepairCount
}) => {
  return (
    <div className="flex justify-between items-start mb-10">
      <h2 className="text-[28px] font-bold text-[#1f1f1f]">Inventory Overview</h2>
      <div className="flex gap-8 text-center uppercase tracking-wider">
        {activeCategory === "Consumables" ? (
          <>
            <div><div className="text-[22px] font-black text-[#ff1a1a]">{outOfStockCount}</div><div className="text-[10px] font-bold text-gray-400">Out of Stock</div></div>
            <div><div className="text-[22px] font-black text-[#ff9900]">{lowStockCount}</div><div className="text-[10px] font-bold text-gray-400">Low Stock</div></div>
          </>
        ) : activeCategory === "Assets" ? (
          <>
            <div><div className="text-[22px] font-black text-[#10b981]">{goodConditionCount}</div><div className="text-[10px] font-bold text-gray-400">Good Condition</div></div>
            <div><div className="text-[22px] font-black text-[#ff9900]">{needRepairCount}</div><div className="text-[10px] font-bold text-gray-400">Need Repair</div></div>
            <div><div className="text-[22px] font-black text-[#ff1a1a]">{needsReplacementCount}</div><div className="text-[10px] font-bold text-gray-400">Needs Replacement</div></div>
            <div><div className="text-[22px] font-black text-[#3385ff]">{underRepairCount}</div><div className="text-[10px] font-bold text-gray-400">Under Repair</div></div>
          </>
        ) : (
          <div><div className="text-[22px] font-black text-[#1f1f1f]">{totalItems}</div><div className="text-[10px] font-bold text-gray-400">Total Items</div></div>
        )}
      </div>
    </div>
  );
};