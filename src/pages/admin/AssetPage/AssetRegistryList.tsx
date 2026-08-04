import React from "react";
import { MapPin, Calendar, Edit3, Trash2, AlertCircle, Wrench, Eye, CheckCircle2 } from "lucide-react";
import type { Asset } from "../../../types/asset";

// set temporarily to any[] for now, will refine later
interface Props {
  filteredAssets: any[];
  onAssetClick: (asset: any) => void;
  onDeleteAsset: (asset: any) => void;
}

// condition styles
const statusStyles: Record<string, { badge: string; icon: React.ReactNode }> = {
  "Working": {
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200", 
    icon: <CheckCircle2 size={12} />
  },
  "Under Repair": {
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    icon: <Wrench size={12} />
  },
  "Damaged": {
    badge: "bg-amber-50 text-amber-600 border-amber-200",
    icon: <AlertCircle size={12} />
  },
  "Hazardous": {
    badge: "bg-red-50 text-red-600 border-red-200",
    icon: <AlertCircle size={12} />
  },
};

// recommendation styles
const recommendationStyles: Record<string, { badge: string; icon: React.ReactNode }> = {
  "Replace Immediately": {
    badge: "bg-red-50 text-red-600 border-red-200",
    icon: <AlertCircle size={12} />,
  },
  "Monitor Closely": {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-300",
    icon: <Eye size={12} />,
  },
};

export const AssetRegistryList: React.FC<Props> = ({ filteredAssets, onAssetClick, onDeleteAsset }) => {
  // Currency formatter for PHP
  const formatPHP = (num: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(num);

  if (filteredAssets.length === 0) {
    return (
      <div className="p-16 text-center text-gray-400">
        No active gym assets found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <th className="py-4 px-6">QR Code</th>
            <th className="py-4 px-6">Asset</th>
            <th className="py-4 px-6">Zone</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Financial</th>
            <th className="py-4 px-6">Maintenance</th>
            <th className="py-4 px-6">Recommendation</th>
            <th className="py-4 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {filteredAssets.map((asset) => {
            const recommendationTheme = recommendationStyles[asset.recommendation] || {
              badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
              icon: <CheckCircle2 size={12} />,
            };

            return (
              <tr key={asset.assetId} className="hover:bg-gray-50/50 transition-colors">
                {/* QR code image */}
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-900">
                    <img className="w-20 h-20 object-contain" src={asset.qrCode} alt={`${asset.name} QR Code`} />
                  </div>
                </td>

                {/* Asset Specification */}
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-900">{asset.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {asset.assetId} • {asset.category}
                  </div>
                </td>

                {/* Zone/Area */}
                <td className="py-4 px-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
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
                  <div><span className="text-gray-400">SRP:</span> <span className="text-gray-700">{formatPHP(asset.srp)}</span></div>
                  <div><span className="text-gray-400">Value:</span> <span className="text-gray-700">{formatPHP(asset.value)}</span></div>
                  <div>
                    <span className="text-gray-400">Repairs:</span>{" "}
                    <span className={asset.repairsCost > 0 ? "text-red-500 font-bold" : "text-gray-700"}>
                      {formatPHP(asset.repairsCost)}
                    </span>
                  </div>
                </td>

                {/* Maintenance Schedule logs */}
                <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                  {asset.maintenanceCount ? (
                    <>
                      <div>{asset.maintenanceCount} times</div>
                      {asset.lastMaintenanceDate && (
                        <div className="flex items-center gap-1 mt-1 text-gray-500">
                          <Calendar size={12} />
                          <span>{asset.lastMaintenanceDate}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400">No recorded maintenance</div>
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