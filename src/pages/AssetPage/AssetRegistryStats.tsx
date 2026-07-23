import React from "react";

interface Props {
  assets: any[];
}

export const AssetRegistryStats: React.FC<Props> = ({ assets }) => {
  const total = assets.length;
  const working = assets.filter((a) => a.condition === "Working").length;
  const damaged = assets.filter((a) => a.condition === "Damaged").length;
  const underRepair = assets.filter((a) => a.condition === "Under Repair").length;
  const hazardous = assets.filter((a) => a.condition === "Hazardous").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
      {/* Total Assets */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-400 text-[10px] sm:text-xs font-semibold">Total Assets</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 text-black">{total}</p>
      </div>
      {/* Working */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl border border-emerald-200 shadow-sm">
        <p className="text-emerald-600 text-[10px] sm:text-xs font-semibold">Working</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 text-emerald-600">{working}</p>
      </div>
      {/* Damaged */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl border border-amber-200 shadow-sm">
        <p className="text-amber-600 text-[10px] sm:text-xs font-semibold">Damaged</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 text-amber-600">{damaged}</p>
      </div>
      {/* Under Repair */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl border border-blue-200 shadow-sm">
        <p className="text-blue-600 text-[10px] sm:text-xs font-semibold">Under Repair</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 text-blue-600">{underRepair}</p>
      </div>
      {/* Hazardous */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl border border-red-200 shadow-sm">
        <p className="text-red-600 text-[10px] sm:text-xs font-semibold">Hazardous</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 text-red-600">{hazardous}</p>
      </div>
    </div>
  );
};