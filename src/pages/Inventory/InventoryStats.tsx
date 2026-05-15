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

const StatItem = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-1 min-w-[80px]">
    <span className={`[font-family:'Poppins',Helvetica] text-2xl font-bold leading-none ${color}`}>
      {value}
    </span>
    <span className="[font-family:'Poppins',Helvetica] text-[11px] font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
  </div>
);

const Divider = () => <div className="w-px h-8 bg-gray-100 self-center" />;

export const InventoryStats: React.FC<Props> = ({
  activeCategory,
  outOfStockCount,
  lowStockCount,
  totalItems,
  goodConditionCount,
  needRepairCount,
  needsReplacementCount,
  underRepairCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-8">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {activeCategory === "Consumables" ? (
          <>
            <StatItem value={outOfStockCount} label="Out of Stock" color="text-red-500" />
            <Divider />
            <StatItem value={lowStockCount} label="Low Stock" color="text-amber-500" />
          </>
        ) : activeCategory === "Assets" ? (
          <>
            <StatItem value={goodConditionCount} label="Working" color="text-emerald-500" />
            <Divider />
            <StatItem value={needRepairCount} label="Needs Repair" color="text-amber-500" />
            <Divider />
            <StatItem value={needsReplacementCount} label="Replacement" color="text-red-500" />
            <Divider />
            <StatItem value={underRepairCount} label="Under Repair" color="text-blue-500" />
          </>
        ) : (
          <>
            <StatItem value={totalItems} label="Total Items" color="text-[#0a2e27]" />
          </>
        )}
      </div>
    </div>
  );
};