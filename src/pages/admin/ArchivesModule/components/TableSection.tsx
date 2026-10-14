import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ArchiveRecord } from "../../../../types/archive";
import type { ArchivePagination } from "../../../../services/archiveService";

interface TableSectionProps {
  items: ArchiveRecord[];
  pagination: ArchivePagination;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onView: (item: ArchiveRecord) => void;
  onRestore: (item: ArchiveRecord) => void;
}

// Module type tag styling map
const tagStyles: Record<string, string> = {
  IncidentReport: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  Asset: "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  Task: "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  User: "bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  LostAndFound: "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

export const TableSection: React.FC<TableSectionProps> = ({
  items,
  pagination,
  isLoading = false,
  onPageChange,
  onView,
  onRestore,
}) => {
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInput, setPageInput] = useState("");

  // Helper to extract item titles
  const getItemTitle = (item: ArchiveRecord) => {
    return (
      item.data?.item ||
      item.data?.title ||
      item.data?.name ||
      item.data?.itemName ||
      item.data?.username ||
      item.moduleType
    );
  };

  // Helper to extract descriptions
  const getItemDescription = (item: ArchiveRecord) => {
    return (
      item.data?.description ||
      item.data?.details ||
      item.reason ||
      "No detailed description provided."
    );
  };

  const getOriginalDate = (item: ArchiveRecord) =>
    item.data?.dateAndTime || item.data?.createdAt || item.data?.date || item.createdAt;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const totalPages = Math.max(1, pagination.totalPages);
  const currentPage = Math.min(totalPages, Math.max(1, pagination.currentPage));
  const firstVisiblePage = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => firstVisiblePage + index,
  );
  const commitPageInput = () => {
    const requestedPage = Number(pageInput);
    if (Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= totalPages) {
      onPageChange(requestedPage);
    }
    setIsEditingPage(false);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm animate-pulse space-y-4 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-12 bg-slate-100 rounded-xl w-full dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] dark:border-slate-700 dark:bg-slate-900/80">
              <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Item / Archive ID
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Module
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Original Date
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Archived Date
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Reason
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Archived By
              </th>
              <th className="py-4 px-6 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f1f5f9] dark:divide-slate-700">
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.archiveId}
                  className="hover:bg-slate-50/80 transition-colors duration-150 dark:hover:bg-slate-800/80"
                >
                  {/* Item Title & Archive ID */}
                  <td className="py-4 px-6 vertical-align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 text-[#64748b] dark:bg-slate-800 dark:text-slate-300">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#0f172a] leading-snug truncate max-w-[200px] dark:text-slate-100">
                          {getItemTitle(item)}
                        </h3>
                        <span className="text-xs text-gray-400 block tracking-wide font-mono mt-0.5 dark:text-slate-400">
                          {item.archiveId || item._id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Module Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        tagStyles[item.moduleType] ||
                        "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {item.moduleType}
                    </span>
                  </td>

                  {/* Original Date */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">
                      {formatDate(getOriginalDate(item))}
                    </span>
                  </td>

                  {/* Archived Date */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">
                      {formatDate(item.createdAt)}
                    </span>
                  </td>

                  {/* Reason */}
                  <td className="py-4 px-4 max-w-[200px]">
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 dark:text-slate-300">
                      {item.reason || "No reason provided."}
                    </p>
                  </td>

                  {/* Archived By */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">
                      {item.archivedBy || "System Admin"}
                    </span>
                  </td>
                  
                  

                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onView(item);
                        }}
                        className="flex items-center gap-1 border border-[#cbd5e1] hover:bg-slate-100 text-[#334155] text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer active:scale-[0.97] dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-[#475569] dark:text-slate-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onRestore(item);
                        }}
                        className="flex items-center gap-1 border border-[#3b82f6] hover:bg-[#eff6ff] text-[#3b82f6] text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer active:scale-[0.97] dark:border-blue-500 dark:text-blue-300 dark:hover:bg-slate-800"
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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <p className="text-sm text-gray-500 dark:text-slate-300">
                    No archived records match your criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[#e2e8f0] bg-white px-5 py-3.5 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs text-gray-500 dark:text-slate-300">
          Showing <span className="font-semibold text-[#0f2942] dark:text-slate-100">{items.length}</span> of{" "}
          <span className="font-semibold text-[#0f2942] dark:text-slate-100">{pagination.totalArchives}</span> archives (Page{" "}
          <span className="font-semibold text-[#0f2942] dark:text-slate-100">{currentPage}</span> of{" "}
          <span className="font-semibold text-[#0f2942] dark:text-slate-100">{totalPages}</span>)
        </p>
        <nav className="flex items-center gap-1" aria-label="Archive pages">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#0f2942] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={16} />
          </button>
          {visiblePages.map((pageNumber) => (
            pageNumber === currentPage ? (
              <div key={pageNumber} className="flex flex-col items-center">
                {isEditingPage ? (
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageInput}
                    autoFocus
                    aria-label={`Enter page number, from 1 to ${totalPages}`}
                    onChange={(event) => setPageInput(event.target.value)}
                    onBlur={commitPageInput}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                      }
                    }}
                    className="h-9 w-9 rounded-lg border border-[#113129] bg-white text-center text-xs font-semibold text-[#113129] outline-none dark:border-emerald-500 dark:bg-slate-800 dark:text-emerald-300"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setPageInput(String(currentPage));
                      setIsEditingPage(true);
                    }}
                    aria-label={`Current page ${currentPage}. Click to enter a page number`}
                    aria-current="page"
                    className="h-9 w-9 rounded-lg border border-[#113129] bg-[#113129] text-xs font-semibold text-white dark:border-[#207D55] dark:bg-[#207D55]"
                  >
                    {pageNumber}
                  </button>
                )}
                <span className="mt-1 whitespace-nowrap text-[9px] leading-none text-gray-500 dark:text-slate-400">
                  click to enter page
                </span>
              </div>
            ) : (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Go to page ${pageNumber}`}
                className="h-9 w-9 rounded-lg border border-[#e2e8f0] text-xs font-medium text-[#0f2942] transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {pageNumber}
              </button>
            )
          ))}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#0f2942] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TableSection;