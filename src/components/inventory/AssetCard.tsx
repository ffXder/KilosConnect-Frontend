import React from "react";
import { Wrench, Trash2 } from "lucide-react";
import type { EquipmentAsset } from "../../types/inventory";

interface Props {
  asset: EquipmentAsset;
  onDelete?: (id: string) => void;
}

const CONDITION_STYLES: Record<EquipmentAsset["condition"], string> = {
  Working: "bg-[#ecfdf5] text-[#10b981]",
  Damaged: "bg-[#fef2f2] text-[#ff1a1a]",
  "Need Repair": "bg-[#fff7ed] text-[#ff9900]",
  "Under Repair": "bg-blue-50 text-blue-500",
};

export const AssetCard: React.FC<Props> = ({ asset, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white border-2 border-[#10b981] rounded-2xl group hover:shadow-lg transition-all">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#f4f5f6] text-[#10b981]">
          <Wrench size={24} />
        </div>
        <div>
          <h4 className="text-xl font-bold text-[#1f1f1f]">{asset.name}</h4>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-tight">
            ID: {asset.assetId} • {asset.area}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase ${CONDITION_STYLES[asset.condition]}`}>
          {asset.condition}
        </span>
        <button
          onClick={() => onDelete?.(asset._id)}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
};