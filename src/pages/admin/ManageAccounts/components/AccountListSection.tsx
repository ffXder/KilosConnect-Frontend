import React from "react";
import { ChevronLeft, ChevronRight, User, Edit3, Trash2} from "lucide-react";
import type { UserAccount } from "../../../../types/manageAccount";
import { formatDateTime } from "../../../../utils/formatter";

interface AccountsListSectionProps {
  accounts: UserAccount[];
  totalAccounts: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  onEditClick: (account: UserAccount) => void;
  onDeleteClick: (id: string, name: string) => void;
}

const AccountsListSection: React.FC<AccountsListSectionProps> = ({ 
  accounts, 
  totalAccounts,
  currentPage,
  totalPages,
  onPageChange,
  loading,
  onEditClick, 
  onDeleteClick 
}) => {
  const [isEditingPage, setIsEditingPage] = React.useState(false);
  const [pageInput, setPageInput] = React.useState("");
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

  return (
    <div className="w-full">
      <table className="w-full text-left">
        <thead className="font-semibold text-[#555] text-[11px] uppercase tracking-wider text-left py-2 pr-4 dark:text-slate-300">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">User ID</th>
            <th className="px-6 py-4">Username</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Date Added</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* --- LOADING STATE --- */}
          {loading && (
            <tr>
              <td colSpan={7} className="py-20">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-100 border-t-[#0b3026] rounded-full animate-spin mb-3 dark:border-slate-700 dark:border-t-emerald-500"></div>
                  <p className="text-gray-400 font-medium dark:text-slate-400">Loading account data...</p>
                </div>
              </td>
            </tr>
          )}

          {/* --- EMPTY STATE --- */}
          {!loading && accounts.length === 0 && (
            <tr>
              <td colSpan={7} className="py-20">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4 dark:bg-slate-800">
                    <User className="text-gray-300 dark:text-slate-400" size={32} />
                  </div>
                  <p className="text-gray-500 font-bold text-base dark:text-slate-200">No accounts found</p>
                  <p className="text-gray-400 text-sm max-w-[250px] mx-auto mt-1 dark:text-slate-400">
                    We couldn't find any users matching your current filters.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {/* --- LIST DATA --- */}
          {!loading && accounts.map((acc) => (
            <tr key={acc.userId} className="border-b border-[#eef1f3] text-sm hover:bg-gray-50/50 transition-colors group dark:border-slate-700 dark:hover:bg-slate-800/60">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0b3026] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {acc.firstName[0]}{acc.lastName[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1a1a1a] dark:text-slate-100">{acc.firstName} {acc.lastName}</span>
                  <span className="text-[#6b6b6b] text-[12px] dark:text-slate-400">{acc.email}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-[#555] text-[12px] font-mono dark:text-slate-300">{acc.userId}</td>
              <td className="px-6 py-4 font-medium dark:text-slate-200">{acc.username}</td>
              <td className="px-6 py-4 text-gray-500 dark:text-slate-400">{acc.phoneNumber}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${
                  acc.role === "admin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"
                }`}>
                  {acc.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-400 dark:text-slate-400">{formatDateTime(acc.createdAt)}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => onEditClick(acc)} 
                    className="text-blue-500 font-bold text-xs hover:underline decoration-2 "
                  >
                    <Edit3 size={15} />
                  </button>
                  <button     
                    onClick={() => onDeleteClick(acc._id, acc.firstName)} 
                    className="text-red-500 font-bold text-xs hover:underline decoration-2"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && (
        <div className="flex items-center justify-between gap-4 border-t border-[#eef1f3] px-5 py-3.5 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-300">
            Showing <span className="font-semibold text-[#0f2942] dark:text-slate-100">{accounts.length}</span> of{" "}
            <span className="font-semibold text-[#0f2942] dark:text-slate-100">{totalAccounts}</span> accounts (Page{" "}
            <span className="font-semibold text-[#0f2942] dark:text-slate-100">{currentPage}</span> of{" "}
            <span className="font-semibold text-[#0f2942] dark:text-slate-100">{totalPages}</span>)
          </p>
          <nav className="flex items-center gap-1" aria-label="Account pages">
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
      )}
    </div>
  );
};

export default AccountsListSection;