import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  outOfStockCount: number;
  lowStockCount: number;
}

export const InventoryAlertBanner: React.FC<Props> = ({ outOfStockCount, lowStockCount }) => {
  if (outOfStockCount === 0 && lowStockCount === 0) return null;

  return (
    <div className="mb-8 flex items-center gap-4 p-5 bg-[#fff5f5] border border-[#feb2b2] rounded-2xl">
      <div className="p-2 bg-white rounded-lg border border-[#feb2b2]">
        <AlertCircle className="text-[#ff1a1a]" size={24} />
      </div>
      <div>
        <h3 className="font-bold text-[#ff1a1a] text-lg">Inventory Alert</h3>
        <p className="text-[#ff1a1a] text-sm font-medium">
          {outOfStockCount} out of stock and {lowStockCount} low stock items.
        </p>
      </div>
    </div>
  );
};