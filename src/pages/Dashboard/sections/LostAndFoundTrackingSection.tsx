import React from "react";
import { useLostAndFound } from "../../../hooks/useLostAndFound";

export const LostAndFoundTrackingSection: React.FC = () => {
  const { items } = useLostAndFound();
  const recent = (items ?? []).slice(0, 5);
  const unclaimedCount = (items ?? []).filter(i => i.status === "Unclaimed").length;

  return (
    <section className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <h2 className="font-semibold text-[#1a1a1a] text-xl">Lost and Found</h2>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-2xl text-[#e07000]">{unclaimedCount}</span>
          <span className="text-[#888] text-[11px]">Unclaimed Items</span>
        </div>
      </div>
      <div className="px-6 pb-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#efefef]">
              {["ID", "Item", "Area Found", "Date", "Status"].map(col => (
                <th key={col} className="font-semibold text-[#1a1a1a] text-sm text-left py-2 pr-6 last:pr-0 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(item => (
              <tr key={item.lostId} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="py-2.5 pr-6 text-[#555] text-sm">{item.lostId}</td>
                <td className="py-2.5 pr-6 text-[#1a1a1a] text-sm">{item.item}</td>
                <td className="py-2.5 pr-6 text-[#555] text-sm">{item.areaFound}</td>
                <td className="py-2.5 pr-6 text-[#555] text-sm">{item.date}</td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-medium ${
                    item.status === "Unclaimed" ? "bg-[#fff0e0] text-[#e07000]" : "bg-[#e0f5e9] text-[#1b9640]"
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};