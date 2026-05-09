import React, { useState, useEffect } from "react";

// Updated Mock services with Out of Stock data
const mockFetchAssets = async () => [
   { _id: "a1", name: "Hammer Strength Seated Leg Curl", assetId: "AST-101", area: "Mezzanine", condition: "Good Condition", description: "Leg machine" },
  { _id: "a2", name: "Lifefitness Strength Abdominal", assetId: "AST-102", area: "Mezzanine", condition: "Good Condition", description: "Ab machine" },
  // Crossfit Area
  { _id: "a5", name: "Eleiko Stick", assetId: "AST-105", area: "CrossFit Area", condition: "Good Condition", description: "12 pieces" },
  { _id: "a6", name: "Non Magnet Lock-Jaw Pro", assetId: "AST-106", area: "CrossFit Area", condition: "Good Condition", description: "28 pieces" },
  // Powerlifting Area
  { _id: "a9", name: "Eleiko 25kg Red1 Sweden PL Plates", assetId: "AST-109", area: "Powerlifting Area", condition: "Good Condition", description: "14 pieces" },
  { _id: "a10", name: "Eleiko 25kg Red2 Sweden PL Plates", assetId: "AST-110", area: "Powerlifting Area", condition: "Good Condition", description: "20 pieces" },
  // Open WOD
  { _id: "a13", name: "Concept 2 SkiERG", assetId: "AST-113", area: "Open WOD Area", condition: "Good Condition", description: "4 units" },
  { _id: "a14", name: "Concept 2 Rower", assetId: "AST-114", area: "Open WOD Area", condition: "Good Condition", description: "4 units" },

  // Weightlifting Area
  { _id: "a18", name: "25kg Eleiko Plate", assetId: "AST-118", area: "Weightlifting Area", condition: "Good Condition", description: "6 pieces" },
  { _id: "a19", name: "20kg Eleiko Plate", assetId: "AST-119", area: "Weightlifting Area", condition: "Good Condition", description: "2 pieces" },
];

const mockFetchConsumables = async () => [
  // Maintenance Storage
  { _id: "c1", name: "Joy Dishwashing 1050ml", consumableId: "CON-001", quantity: 2, lowStockAlert: 1, unit: "bottles", area: "Maintenance Storage", description: "Dishwashing liquid", lastRestocked: "2024-05-10" },
  { _id: "c2", name: "Mortein 250ml", consumableId: "CON-002", quantity: 2, lowStockAlert: 1, unit: "bottles", area: "Maintenance Storage", description: "Insecticide", lastRestocked: "2024-05-10" },
  { _id: "c3", name: "Mortein 500ml", consumableId: "CON-003", quantity: 2, lowStockAlert: 1, unit: "bottles", area: "Maintenance Storage", description: "Insecticide", lastRestocked: "2024-05-10" },
  { _id: "c4", name: "Baygon 500m", consumableId: "CON-004", quantity: 3, lowStockAlert: 1, unit: "bottles", area: "Maintenance Storage", description: "Insecticide", lastRestocked: "2024-05-10" },
  // General Storage
  { _id: "c5", name: "Mops", consumableId: "CON-005", quantity: 2, lowStockAlert: 1, unit: "pcs", area: "General Storage", description: "Cleaning mops", lastRestocked: "2024-05-10" },
  { _id: "c6", name: "4in1", consumableId: "CON-006", quantity: 2, lowStockAlert: 1, unit: "pcs", area: "General Storage", description: "Multi-purpose cleaner", lastRestocked: "2024-05-10" },
  { _id: "c7", name: "Singer All Purpose Oil", consumableId: "CON-007", quantity: 14, lowStockAlert: 5, unit: "bottles", area: "General Storage", description: "Equipment lubricant", lastRestocked: "2024-05-10" },
  { _id: "c8", name: "Lysol All In One Disinfectant", consumableId: "CON-008", quantity: 2, lowStockAlert: 1, unit: "bottles", area: "General Storage", description: "Concentrate disinfectant", lastRestocked: "2024-05-10" },
];

const conditionStyles: Record<string, { color: string; bg: string }> = {
  working: { color: "#1a7a4a", bg: "#e6f4ed" },
  "needs replacement": { color: "#d72c2c", bg: "#fdecea" },
  "need repair": { color: "#e09000", bg: "#fff3e0" },
  "under repair": { color: "#0056d2", bg: "#e8f0fe" },
};

function normalizeCondition(condition: string) {
  return condition?.toLowerCase() ?? "working";
}

export const AssetInventorySummarySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assets" | "consumables">("assets");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = activeTab === "assets" ? await mockFetchAssets() : await mockFetchConsumables();
        setRows(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab]);

  const summaryStats = activeTab === "assets" 
    ? [
        { value: rows.length, label: "Total Assets", valueColor: "text-[#1a1a1a]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "working").length, label: "Good Condition", valueColor: "text-[#1a7a4a]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "needs replacement").length, label: "Needs Replacement", valueColor: "text-[#d72c2c]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "need repair").length, label: "Need Repair", valueColor: "text-[#e09000]" },
        { value: rows.filter(r => normalizeCondition(r.condition) === "under repair").length, label: "Under Repair", valueColor: "text-[#0056d2]" },
      ]
    : [
        { value: rows.length, label: "Total Consumables", valueColor: "text-[#1a1a1a]" },
        { value: rows.filter(r => r.quantity === 0).length, label: "Out of Stock", valueColor: "text-red-700" },
        { value: rows.filter(r => r.quantity > 0 && r.quantity <= r.lowStockAlert).length, label: "Low Stock", valueColor: "text-[#ff9900]" },
        { value: rows.reduce((acc, r) => acc + (r.quantity || 0), 0), label: "Total Items", valueColor: "text-[#1a4d3e]" },
      ];

  const headers = activeTab === "assets" 
    ? ["ID", "Equipment", "Condition", "Date"] 
    : ["ID", "Name", "Quantity", "Location"];

  return (
    <section className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-[#1a1a1a] text-xl m-0">Inventory Overview</h2>
          <div className="flex gap-2">
            {(["assets", "consumables"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setRows([]); setActiveTab(tab); }}
                className={`px-4 h-[26px] rounded-[5px] font-medium text-xs capitalize transition-colors cursor-pointer ${
                  activeTab === tab ? "bg-[#1a4d3e] text-white" : "bg-[#e8e8e8] text-[#777]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {summaryStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className={`font-semibold text-2xl leading-none ${s.valueColor}`}>{s.value}</span>
              <span className="font-normal text-[#888] text-[11px] whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-y-scroll flex-1 px-6 pb-5 max-h-[350px] custom-scrollbar" style={{ scrollbarGutter: 'stable' }}>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-[#efefef]">
              {headers.map((col) => (
                <th key={col} className="font-semibold text-[#1a1a1a] text-sm text-left py-3 pr-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-[#aaa] text-sm">Loading...</td></tr>
            ) : (
              rows.map((row) => {
                const id = activeTab === "assets" ? row.assetId : row.consumableId;
                const condition = normalizeCondition(row.condition);
                return (
                  <tr key={id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 pr-4 text-[#555] text-xs font-mono">{id}</td>
                    <td className="py-3 pr-4 text-[#1a1a1a] text-sm font-medium">{row.name}</td>
                    {activeTab === "assets" ? (
                      <>
                        <td className="py-3 pr-4">
                          <span
                            className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                            style={{ 
                              color: conditionStyles[condition]?.color || "#555", 
                              backgroundColor: conditionStyles[condition]?.bg || "#eee" 
                            }}
                          >
                            {/* Logic to show "Good Condition" if working */}
                            {condition === "working" ? "Good Condition" : (row.condition || "Good Condition")}
                          </span>
                        </td>
                        <td className="py-3 text-[#555] text-sm">
                          {row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : "1/1/2026"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pr-4 text-[#1a1a1a] text-sm">
                          {row.quantity === 0 ? (
                            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100 text-[10px] font-bold uppercase tracking-wider">
                              Out of Stock
                            </span>
                          ) : (
                            <>
                              <span className={row.quantity <= (row.lowStockAlert || 0) ? "text-[#ff9900] font-bold" : ""}>
                                {row.quantity}
                              </span>
                              <span className="text-[#888] ml-1 text-xs">{row.unit || "pcs"}</span>
                            </>
                          )}
                        </td>
                        <td className="py-3 text-[#555] text-sm italic">{row.location || "Main Gym"}</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; display: block !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a4d3e; border-radius: 10px; border: 2px solid #f1f1f1; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #1a4d3e #f1f1f1; }
      `}</style>
    </section>
  );
};