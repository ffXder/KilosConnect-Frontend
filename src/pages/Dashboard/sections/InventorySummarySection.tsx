import React, { useState } from "react";
import { useAssets } from "../../../hooks/useAssets";
import { useConsumables } from "../../../hooks/useConsumables";
import { formatDate } from "../../../utils/formatter";

const conditionStyles: Record<string, { color: string; bg: string }> = {
  "good condition": { color: "#1a7a4a", bg: "#e6f4ed" },
  "needs replacement": { color: "#d72c2c", bg: "#fdecea" },
  "needs repair": { color: "#e09000", bg: "#fff3e0" },
  "under repair": { color: "#0056d2", bg: "#e8f0fe" },
};

function normalizeCondition(condition: string) {
  return condition?.toLowerCase() ?? "working";
}

export const InventorySummarySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assets" | "consumables">("assets");
  const { assets, loading: assetsLoading } = useAssets();
  const { consumables, loading: consumablesLoading } = useConsumables();

  const rows = (activeTab === "assets" ? assets : consumables) as any[];
  const loading = activeTab === "assets" ? assetsLoading : consumablesLoading;

  // Only show 4 most recent
  const recentRows = rows.slice(0, 4);

  const summaryStats =
    activeTab === "assets"
      ? [
          { value: rows.length, label: "Total", valueColor: "text-[#1a1a1a]" },
          { value: rows.filter((r) => normalizeCondition(r.condition) === "good condition").length, label: "Good", valueColor: "text-[#1a7a4a]" },
          { value: rows.filter((r) => normalizeCondition(r.condition) === "needs replacement").length, label: "Replace", valueColor: "text-[#d72c2c]" },
          { value: rows.filter((r) => normalizeCondition(r.condition) === "needs repair").length, label: "Repair", valueColor: "text-[#e09000]" },
          { value: rows.filter((r) => normalizeCondition(r.condition) === "under repair").length, label: "In Repair", valueColor: "text-[#0056d2]" },
        ]
      : [
          { value: rows.length, label: "Total", valueColor: "text-[#1a1a1a]" },
          { value: rows.filter((r) => r.quantity === 0).length, label: "Out of Stock", valueColor: "text-red-700" },
          { value: rows.filter((r) => r.quantity > 0 && r.quantity <= r.lowStockAlert).length, label: "Low Stock", valueColor: "text-[#ff9900]" },
          { value: rows.reduce((acc, r) => acc + (r.quantity || 0), 0), label: "Items", valueColor: "text-[#1a4d3e]" },
        ];

  const headers =
    activeTab === "assets"
      ? ["ID", "Equipment", "Condition", "Purchase Date"]
      : ["ID", "Name", "Quantity", "Location"];

  return (
    <>
      <section className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 gap-3 flex-wrap border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-semibold text-[#1a1a1a] text-lg m-0">Inventory Overview</h2>
            <div className="flex gap-2">
              {(["assets", "consumables"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 h-[24px] rounded-[5px] font-medium text-xs capitalize transition-colors cursor-pointer ${
                    activeTab === tab ? "bg-[#072821] text-[#FDFFE0]" : "bg-[#e8e8e8] text-[#777]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 flex-wrap">
            {summaryStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className={`font-bold text-xl leading-none ${s.valueColor}`}>{s.value}</span>
                <span className="font-normal text-[#999] text-[10px] whitespace-nowrap">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table — fixed 5 rows, no scroll */}
        <div className="px-6 pb-5 pt-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-[#aaa] text-sm gap-2">
              <svg className="animate-spin w-4 h-4 text-[#1a4d3e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading...
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#efefef]">
                  {headers.map((col) => (
                    <th key={col} className="font-semibold text-[#555] text-[11px] uppercase tracking-wider text-left py-2 pr-4">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-[#bbb] text-sm">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  recentRows.map((row) => {
                    const id = activeTab === "assets" ? row.assetId : row.consumableId;
                    const condition = normalizeCondition(row.condition);
                    return (
                      <tr key={id} className="border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa] transition-colors">
                        <td className="py-3 pr-4 text-[#555] text-xs font-mono">{id}</td>
                        <td className="py-2.5 pr-4 text-[#1a1a1a] text-sm font-medium truncate max-w-[140px]">{row.name}</td>

                        {activeTab === "assets" ? (
                          <>
                            <td className="py-2.5 pr-4">
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                                style={{
                                  color: conditionStyles[condition]?.color || "#555",
                                  backgroundColor: conditionStyles[condition]?.bg || "#eee",
                                }}
                              >
                                {condition === "working" ? "Good" : row.condition || "Good"}
                              </span>
                            </td>
                            <td className="py-2.5 text-[#999] text-xs">
                              {row.purchaseDate ? formatDate(row.purchaseDate) : "—"}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2.5 pr-4 text-sm">
                              {row.quantity === 0 ? (
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                  Out of Stock
                                </span>
                              ) : (
                                <span className={row.quantity <= (row.lowStockAlert || 0) ? "text-[#ff9900] font-bold" : "text-[#1a1a1a]"}>
                                  {row.quantity}
                                  <span className="text-[#bbb] ml-1 text-xs font-normal">{row.unit || "pcs"}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-[#999] text-xs">{row.location || "Main Gym"}</td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* Footer link */}
          {!loading && rows.length > 4 && (
            <p className="text-center text-[11px] text-[#bbb] mt-3">
              Showing 4 of {rows.length} — 
              <a href="/inventory" className="text-[#1a4d3e] font-medium ml-1 hover:underline">
                View all
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
};