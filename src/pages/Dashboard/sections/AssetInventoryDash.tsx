import React, { useState } from "react";

export type InventoryRow = {
  id: string;
  equipment: string;
  condition: string;
  conditionColor: string;
  conditionBg: string;
  purchaseDate: string;
};

// TODO: Replace with MongoDB fetch – e.g. GET /api/inventory
const inventoryRows: InventoryRow[] = [];

const summaryStats = [
  { value: 0, label: "Total Assets", valueColor: "text-[#1a1a1a]" },
  { value: 0, label: "Damaged", valueColor: "text-[#d72c2c]" },
  { value: 0, label: "Need Repair", valueColor: "text-[#e09000]" },
  { value: 0, label: "Under Repair", valueColor: "text-[#0056d2]" },
];

const conditionPill = (condition: string, color: string, bg: string) => (
  <span
    className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] [font-family:'Poppins',Helvetica] font-medium whitespace-nowrap"
    style={{ color, backgroundColor: bg }}
  >
    {condition}
  </span>
);

export const AssetInventorySummarySection : React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assets" | "consumables">("assets");

  return (
    <section
      aria-labelledby="inventory-overview-title"
      className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <div className="flex flex-col gap-3">
          <h2
            id="inventory-overview-title"
            className="[font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-xl m-0 p-0"
          >
            Inventory Overview
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("assets")}
              className={`px-4 h-[26px] rounded-[5px] [font-family:'Poppins',Helvetica] font-medium text-xs transition-colors cursor-pointer ${
                activeTab === "assets"
                  ? "bg-[#1a4d3e] text-white"
                  : "bg-[#e8e8e8] text-[#777]"
              }`}
            >
              Assets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("consumables")}
              className={`px-4 h-[26px] rounded-[5px] [font-family:'Poppins',Helvetica] font-medium text-xs transition-colors cursor-pointer ${
                activeTab === "consumables"
                  ? "bg-[#1a4d3e] text-white"
                  : "bg-[#e8e8e8] text-[#777]"
              }`}
            >
              Consumables
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {summaryStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className={`[font-family:'Poppins',Helvetica] font-semibold text-2xl leading-none ${s.valueColor}`}>
                {s.value}
              </span>
              <span className="[font-family:'Poppins',Helvetica] font-normal text-[#888] text-[11px] whitespace-nowrap">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#efefef]">
              {["ID", "Equipment", "Condition", "Purchase Date"].map((col) => (
                <th
                  key={col}
                  className="[font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-sm text-left py-2 pr-6 last:pr-0 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventoryRows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-[#bbb] [font-family:'Poppins',Helvetica] text-sm"
                >
                  No inventory data available.
                </td>
              </tr>
            ) : (
              inventoryRows.map((row) => (
              <tr key={row.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#555] text-sm">{row.id}</td>
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#1a1a1a] text-sm">{row.equipment}</td>
                <td className="py-2.5 pr-6">
                  {conditionPill(row.condition, row.conditionColor, row.conditionBg)}
                </td>
                <td className="py-2.5 [font-family:'Poppins',Helvetica] text-[#555] text-sm">{row.purchaseDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
 );
};