import React from "react";
import type { ArchiveItem } from "../ArchivesMain";

interface RecentArchivesSectionProps {
  items: ArchiveItem[];
  onView: (item: ArchiveItem) => void;
  onRestore: (item: ArchiveItem) => void;
}

const tagStyles: Record<ArchiveItem["type"], string> = {
  Incident: "bg-[#fff5f5] text-[#ef4444] border border-[#fee2e2]",
  Asset: "bg-[#f0f7ff] text-[#3b82f6] border border-[#bfdbfe]",
  Maintenance: "bg-[#f2fdf7] text-[#22c55e] border border-[#bbf7d0]",
};

const RecentArchivesSection: React.FC<RecentArchivesSectionProps> = ({ items, onView, onRestore }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-[#cbd5e1] p-12 text-center">
        <p className="text-sm text-gray-500">No archived records match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Item</th>
              <th className="py-3.5 px-4">Original Date</th>
              <th className="py-3.5 px-4">Archived Date</th>
              <th className="py-3.5 px-4">Archived By</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                {/* Item Details Column */}
                <td className="py-4 px-5 max-w-[320px]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 text-[#64748b] mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#0f172a] truncate">{item.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagStyles[item.type]}`}>
                          {item.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block tracking-wide mt-0.5">{item.archiveId}</span>
                      <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </td>

                {/* Original Date */}
                <td className="py-4 px-4 text-xs font-semibold text-[#334155] whitespace-nowrap align-top pt-5">
                  {item.originalDate}
                </td>

                {/* Archived Date */}
                <td className="py-4 px-4 text-xs font-semibold text-[#334155] whitespace-nowrap align-top pt-5">
                  {item.archivedDate}
                </td>

                {/* Archived By */}
                <td className="py-4 px-4 text-xs font-semibold text-[#334155] whitespace-nowrap align-top pt-5">
                  {item.archivedBy}
                </td>

                {/* Reason */}
                <td className="py-4 px-4 text-xs font-semibold text-[#334155] align-top pt-5 max-w-[200px]">
                  <span className="truncate block" title={item.reason}>
                    {item.reason}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-5 align-top pt-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(item)}
                      className="flex items-center gap-1.5 border border-[#cbd5e1] hover:bg-slate-50 text-[#334155] text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <svg className="w-3.5 h-3.5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>

                    <button
                      onClick={() => onRestore(item)}
                      className="flex items-center gap-1.5 border border-[#3b82f6] hover:bg-[#eff6ff] text-[#3b82f6] text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992V4.356m0 0L18.75 6.621A9 9 0 1 0 21 12m0-7.644V9.75"
                        />
                      </svg>
                      Restore
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentArchivesSection;