import React from "react";
import { useLostAndFound } from "../../../hooks/useLostAndFound";
import { formatDate } from "../../../utils/formatter";
export const LostAndFoundTrackingSection: React.FC = () => {
  const { items } = useLostAndFound();
  const allItems = items ?? [];
  const recentRows = allItems.slice(0, 4);
  const unclaimedCount = allItems.filter(i => i.status === "Unclaimed").length;

  return (
    <section className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#f0f0f0] flex-wrap gap-3">
        <h2 className="font-semibold text-[#1a1a1a] text-xl">Lost and Found</h2>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-xl leading-none text-[#1a1a1a]">{allItems.length}</span>
            <span className="text-[#999] text-[10px]">Total</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-xl leading-none text-[#e07000]">{unclaimedCount}</span>
            <span className="text-[#999] text-[10px]">Unclaimed</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-xl leading-none text-[#1b9640]">{allItems.filter(i => i.status === "Claimed").length}</span>
            <span className="text-[#999] text-[10px]">Claimed</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-5 pt-3 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#efefef]">
              {["ID", "Item", "Area Found", "Date", "Status"].map(col => (
                <th key={col} className="font-semibold text-[#555] text-[11px] uppercase tracking-wider text-left py-2 pr-6 last:pr-0 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#bbb] text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              recentRows.map(item => (
                <tr key={item.lostId} className="border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 pr-4 text-[#555] text-xs font-mono">{item.lostId}</td>
                  <td className="py-2.5 pr-6 text-[#1a1a1a] text-sm font-medium truncate max-w-[140px]">{item.item}</td>
                  <td className="py-2.5 pr-6 text-[#999] text-xs">{item.areaFound}</td>
                  <td className="py-2.5 pr-6 text-[#999] text-xs">{formatDate(item.date)}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-medium ${
                      item.status === "Unclaimed" ? "bg-[#fff0e0] text-[#e07000]" : "bg-[#e0f5e9] text-[#1b9640]"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {allItems.length > 4 && (
          <p className="text-center text-[11px] text-[#bbb] mt-3">
            Showing 4 of {allItems.length} —{" "}
            <a href="/lost-and-found" className="text-[#1a4d3e] font-medium ml-1 hover:underline">
              View all
            </a>
          </p>
        )}
      </div>
    </section>
  );
};