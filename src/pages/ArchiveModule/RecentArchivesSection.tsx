import React from "react";
import type { ArchiveItem } from "./ArchivesMain";

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
  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#e2e8f0] p-3 sm:p-4 lg:p-6 shadow-sm flex flex-col lg:flex-row items-start justify-between gap-3 sm:gap-4 lg:gap-6 hover:shadow-md transition-shadow duration-200 w-full overflow-hidden"
          >
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0 w-full">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 text-[#64748b]">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>

              <div className="flex-1 min-w-0 w-full overflow-hidden">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className="text-[12px] sm:text-sm lg:text-base font-bold text-[#0f172a] leading-tight truncate max-w-full">{item.title}</h3>
                  <span className={`text-[9px] sm:text-[10px] lg:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${tagStyles[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] lg:text-xs text-gray-400 mt-0.5 block tracking-wide truncate">{item.archiveId}</span>
                <p className="text-[11px] sm:text-[12px] lg:text-sm text-[#475569] mt-1 sm:mt-1.5 lg:mt-2.5 leading-relaxed line-clamp-1 sm:line-clamp-2 break-words">{item.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-1.5 sm:gap-y-2 lg:gap-y-3 gap-x-2 sm:gap-x-3 lg:gap-x-6 mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-[#f1f5f9] w-full">
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] lg:text-[11px] font-medium text-gray-400 uppercase tracking-wider">Original</span>
                    <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold text-[#334155] mt-0.5 block truncate">{item.originalDate}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] lg:text-[11px] font-medium text-gray-400 uppercase tracking-wider">Archived</span>
                    <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold text-[#334155] mt-0.5 block truncate">{item.archivedDate}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] lg:text-[11px] font-medium text-gray-400 uppercase tracking-wider">By</span>
                    <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold text-[#334155] mt-0.5 block truncate">{item.archivedBy}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] lg:text-[11px] font-medium text-gray-400 uppercase tracking-wider">Reason</span>
                    <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold text-[#334155] mt-0.5 block truncate">{item.reason}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row sm:flex-row lg:flex-col gap-1.5 sm:gap-2 w-full sm:w-auto flex-shrink-0">
              <button 
                onClick={() => onView(item)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 border border-[#cbd5e1] hover:bg-slate-50 text-[#334155] text-[10px] sm:text-[11px] lg:text-xs font-semibold py-1 sm:py-1.5 lg:py-2 px-2 sm:px-2.5 lg:px-3 rounded-lg transition-colors cursor-pointer active:scale-[0.97]"
              >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">View</span>
                <span className="sm:hidden">View</span>
              </button>
              
              <button 
                onClick={() => onRestore(item)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 border border-[#3b82f6] hover:bg-[#eff6ff] text-[#3b82f6] text-[10px] sm:text-[11px] lg:text-xs font-semibold py-1 sm:py-1.5 lg:py-2 px-2 sm:px-2.5 lg:px-3 rounded-lg transition-colors cursor-pointer active:scale-[0.97]"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4"
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

          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-dashed border-[#cbd5e1] p-6 sm:p-8 lg:p-12 text-center">
          <p className="text-xs sm:text-sm text-gray-500">No archived records match your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RecentArchivesSection;
