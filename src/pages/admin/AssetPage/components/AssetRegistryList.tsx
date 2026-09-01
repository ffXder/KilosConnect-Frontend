import React from "react";
import { MapPin, Calendar, Edit3, Trash2, AlertCircle, Wrench, Eye, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "../../../../utils/formatter";


interface Props {
  isLoading?: boolean;
  filteredAssets: any[]; // set temporarily to any[] for now, will polish later
  onAssetClick: (asset: any) => void;
  onDeleteAsset: (asset: any) => void;
}

// condition styles
const statusStyles: Record<string, { badge: string; icon: React.ReactNode }> = {
  "Working": {
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-600", 
    icon: <CheckCircle2 size={12} />
  },
  "Under Repair": {
    badge: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-600",
    icon: <Wrench size={12} />
  },
  "Damaged": {
    badge: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-600",
    icon: <AlertCircle size={12} />
  },
  "Hazardous": {
    badge: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-600",
    icon: <AlertCircle size={12} />
  },
  "Decommissioned": {
    badge: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-600",
    icon: <AlertCircle size={12} />
  }
};

// recommendation styles
const recommendationStyles: Record<string, { badge: string; icon: React.ReactNode }> = {
  "Healthy": {
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-600",
    icon: <CheckCircle2 size={12} />
  },
  "Replace Immediately": {
    badge: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-600",
    icon: <AlertCircle size={12} />,
  },
  "Monitor Closely": {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-600",
    icon: <Eye size={12} />,
  }
};

export const AssetRegistryList: React.FC<Props> = ({ isLoading = false, filteredAssets, onAssetClick, onDeleteAsset }) => {
  // Currency formatter for PHP
  const formatPHP = (num: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(num);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:bg-slate-950 transition-color duration-300 dark:border-slate-600">
            <th className="py-4 px-6 dark:text-slate-300">QR Code</th>
            <th className="py-4 px-6 dark:text-slate-300">Asset</th>
            <th className="py-4 px-6 dark:text-slate-300">Zone</th>
            <th className="py-4 px-6 dark:text-slate-300">Status</th>
            <th className="py-4 px-6 dark:text-slate-300">Financial</th>
            <th className="py-4 px-6 dark:text-slate-300">Maintenance</th>
            <th className="py-4 px-6 dark:text-slate-300">Recommendation</th>
            <th className="py-4 px-6 text-center dark:text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm dark:bg-slate-950 transition-color duration-300 dark:divide-slate-800">
          {isLoading ? (
            /* Skeleton loading */
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                {/* QR Code */}
                <td className="py-4 px-6">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                </td>
                {/* Asset */}
                <td className="py-4 px-6">
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-32 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-24" />
                </td>
                {/* Zone */}
                <td className="py-4 px-6">
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-24" />
                </td>
                {/* Status */}
                <td className="py-4 px-6">
                  <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-full w-20" />
                </td>
                {/* Financial */}
                <td className="py-4 px-6 space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-20" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-24" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-16" />
                </td>
                {/* Maintenance */}
                <td className="py-4 px-6 space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-16" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-24" />
                </td>
                {/* Recommendation */}
                <td className="py-4 px-6">
                  <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-full w-28" />
                </td>
                {/* Actions */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-slate-800 rounded" />
                    <div className="w-5 h-5 bg-gray-200 dark:bg-slate-800 rounded" />
                  </div>
                </td>
              </tr>
            ))
          ) : filteredAssets.length === 0 ? (
            // empty state
            <tr>
              <td colSpan={8} className="p-16 text-center text-gray-400">
                No active gym assets found matching your criteria.
              </td>
            </tr>
          ) : filteredAssets.map((asset) => {
            // renders
            const recommendationTheme = recommendationStyles[asset.recommendation] || {
              badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
              icon: <CheckCircle2 size={12} />,
            };

            return (
              <tr key={asset.assetId} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-slate-800/50">
                {/* QR code image */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-white rounded-lg border border-gray-200 dark:border-slate-700 shadow-xs inline-block">
                      <img className="w-20 h-20 object-contain" src={asset.qrCode} alt={`${asset.name} QR Code`} />
                    </div>
                  </div>
                </td>

                {/* Asset Specification */}
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-900 dark:text-slate-300">{asset.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 dark:text-slate-400">
                    {asset.assetId} • {asset.category}
                  </div>
                </td>

                {/* Zone/Area */}
                <td className="py-4 px-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5 dark:text-slate-300">
                    <MapPin size={14} className="text-gray-400 dark:text-slate-300" />
                    {asset.area}
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${statusStyles[asset.condition]?.badge || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {statusStyles[asset.condition]?.icon}
                    {asset.condition}
                  </span>
                </td>

                {/* Financial Metrics */}
                <td className="py-4 px-6 text-xs space-y-0.5 font-medium">
                  <div><span className="text-gray-400 dark:text-slate-400">SRP:</span> <span className="text-gray-700 dark:text-slate-300">{formatPHP(asset.srp)}</span></div>
                  <div><span className="text-gray-400 dark:text-slate-400">Value:</span> <span className="text-gray-700 dark:text-slate-300">{formatPHP(asset.value)}</span></div>
                  <div>
                    <span className="text-gray-400 dark:text-slate-400">Repairs:</span>{" "}
                    <span className={asset.cumulativeRepairCost > 0 ? "text-red-500 font-bold dark:text-red-400" : "text-gray-700 dark:text-slate-300"}>
                      {formatPHP(asset.cumulativeRepairCost)}
                    </span>
                  </div>
                </td>

                {/* Maintenance Schedule logs */}
                <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                  {asset.maintenanceCount ? (
                    <>
                      <div>{asset.maintenanceCount} times</div>
                      {asset.lastMaintenanceDate && (
                        <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-slate-400">
                          <Calendar size={12} />
                          <span>{formatDateTime(asset.lastMaintenanceDate)}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400 dark:text-slate-400">No recorded maintenance</div>
                  )}
                </td>

                {/* Recommendation */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${recommendationTheme.badge}`}>
                    {recommendationTheme.icon}
                    {asset.recommendation}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onAssetClick(asset)}
                      className="text-blue-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Asset"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteAsset(asset)}
                      className="text-red-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssetRegistryList;