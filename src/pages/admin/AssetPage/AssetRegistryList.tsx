import React from "react";
import { MapPin, Calendar, Edit3, Trash2, AlertCircle, Wrench } from "lucide-react";

interface Props {
  filteredAssets: any[];
  onAssetClick: (asset: any) => void;
  onDeleteAsset: (asset: any) => void;
}

const statusStyles: Record<string, string> = {
  Working: "bg-[#eafaf1] text-[#10b981] border-[#d1fae5]",
  "Under Repair": "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
  Damaged: "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]",
  Hazardous: "bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]",
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
          {filteredAssets.map((asset) => (
            <tr key={asset.assetId} className="hover:bg-gray-50/50 transition-colors">
              {/* QR code image */}
              <td className="py-4 px-6">
                <div className="font-bold text-gray-900">
                  <img className="w-20 h-20" src={asset.qrCode}></img>
                </div>
              </td>

              {/* Asset Specification */}
              <td className="py-4 px-6">
                <div className="font-bold text-gray-900">{asset.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {asset.assetId} • {asset.category}
                </div>
              </td>

              {/* Zone Area */}
              <td className="py-4 px-6 text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  {asset.area}
                </div>
              </td>

              {/* Status Badge */}
              <td className="py-4 px-6">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${statusStyles[asset.status]}`}>
                  {asset.condition === "Hazardous" && <AlertCircle size={12} />}
                  {asset.condition === "Under Repair" && <Wrench size={12} />}
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
                {/* renders the maintenance date is there is maintenance info exist */}
                {asset.maintenanceCount ? (
                  <>
                    <div>{asset.maintenanceCount} times</div>

                    {asset.lastMaintenanceDate && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        <span>{asset.lastMaintenanceDate}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400">No recorded maintenance</div>
                )}
              </td>

              {/* Recommendations */}
              <td className="py-4 px-6 font-bold text-xs">
                <span className={asset.recommendation === "Replace Immediately" ? "text-red-500" : "text-emerald-500"}>
                  {asset.recommendation}
                </span>
              </td>

              {/* Action Buttons */}
              <td className="py-4 px-6">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onAssetClick(asset)}
                    className="text-blue-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => onDeleteAsset(asset)}
                    className="text-red-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetRegistryList;