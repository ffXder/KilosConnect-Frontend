import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  outOfStockCount: number;
  lowStockCount: number;
}

export const NotificationAlertBanner: React.FC<Props> = ({ outOfStockCount, lowStockCount }) => {
  if (outOfStockCount === 0 && lowStockCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#fff5f5] border border-[#feb2b2] rounded-xl">
      <AlertCircle className="text-[#ff1a1a] shrink-0" size={14} />
      <p className="text-[#ff1a1a] text-xs font-medium">
        <span className="font-bold">Restock needed —</span>{" "}
        {outOfStockCount + lowStockCount} consumable{outOfStockCount + lowStockCount !== 1 ? "s" : ""} require attention.{" "}
        <a href="/inventory" className="underline font-bold hover:opacity-75">
          View inventory →
        </a>
      </p>
      </div>
  );
};