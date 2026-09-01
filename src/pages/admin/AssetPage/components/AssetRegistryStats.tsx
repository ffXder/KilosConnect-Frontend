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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total Assets */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-950 dark:border-gray-600 transition-color duration-300">
        <p className="text-gray-400 text-xs font-semibold dark:text-slate-400">Total Assets</p>
        <p className="text-2xl font-bold mt-1 text-black dark:text-slate-300">{total}</p>
      </div>
      {/* Working */}
      <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm dark:bg-emerald-950 dark:border-emerald-600 transition-color duration-300">
        <p className="text-emerald-600 text-xs font-semibold dark:text-slate-300">Working</p>
        <p className="text-2xl font-bold mt-1 text-emerald-600">{working}</p>
      </div>
      {/* Damaged */}
      <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm dark:bg-amber-950 dark:border-amber-600 transition-color duration-300">
        <p className="text-amber-600 text-xs font-semibold dark:text-slate-300">Damaged</p>
        <p className="text-2xl font-bold mt-1 text-amber-600">{damaged}</p>
      </div>
      {/* Under Repair */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm dark:bg-blue-950 dark:border-blue-600 transition-color duration-300">
        <p className="text-blue-600 text-xs font-semibold dark:text-slate-300">Under Repair</p>
        <p className="text-2xl font-bold mt-1 text-blue-600">{underRepair}</p>
      </div>
      {/* Hazardous */}
      <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm dark:bg-red-950 dark:border-red-600 transition-color duration-300">
        <p className="text-red-600 text-xs font-semibold dark:text-slate-300">Hazardous</p>
        <p className="text-2xl font-bold mt-1 text-red-600">{hazardous}</p>
      </div>
    </div>
  );
};