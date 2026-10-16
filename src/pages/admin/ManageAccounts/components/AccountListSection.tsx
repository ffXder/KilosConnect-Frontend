import React from "react";
import { ChevronLeft, ChevronRight, User, Edit3, Trash2, Loader2, ShieldCheck} from "lucide-react";
import type { UserAccount } from "../../../../types/manageAccount";
import { formatDateTime } from "../../../../utils/formatter";

const COLUMNS = ["Name", "User ID", "Username", "Phone number", "Role", "Date added"];
const roleBadge = (isAdmin: boolean) =>
  isAdmin
    ? "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
    : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors focus:outline-none focus-visible:ring-2 dark:text-slate-400";

interface AccountsListSectionProps {
  accounts: UserAccount[];
  totalAccounts: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  onEditClick: (account: UserAccount) => void;
  onDeleteClick: (id: string, name: string) => void;
  onPermissionsClick?: (account: UserAccount) => void;
}

const AccountsListSection: React.FC<AccountsListSectionProps> = ({ 
  accounts, 
  totalAccounts,
  currentPage,
  totalPages,
  onPageChange,
  loading,
  onEditClick,
  onDeleteClick,
  onPermissionsClick,
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
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-gray-50/80 border-b border-[#eef1f3] dark:bg-slate-800/50 dark:border-slate-700 transition-colors duration-300">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-xs font-medium text-gray-500 whitespace-nowrap dark:text-slate-400"
              >
                {col}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium text-gray-500 text-right dark:text-slate-400"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#eef1f3] dark:divide-slate-700">
          {/* Loading */}
          {loading && (
            <tr>
              <td colSpan={7} className="px-6 py-20">
                <div
                  role="status"
                  className="flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-slate-400"
                >
                  <Loader2 size={28} className="animate-spin text-[#0b3026] dark:text-emerald-500" />
                  <p className="text-sm font-medium">Loading account data...</p>
                </div>
              </td>
            </tr>
          )}

          {/* Empty */}
          {!loading && accounts.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-20">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-gray-50 p-4 dark:bg-slate-800">
                    <User className="text-gray-300 dark:text-slate-500" size={28} />
                  </div>
                  <p className="text-base font-semibold text-gray-700 dark:text-slate-200">
                    No accounts found
                  </p>
                  <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-slate-400">
                    We couldn't find any users matching your search.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {/* Rows */}
          {!loading &&
            accounts.map((acc) => {
              const fullName = `${acc.firstName} ${acc.lastName}`;
              const initials = `${acc.firstName?.[0] ?? ""}${acc.lastName?.[0] ?? ""}`.toUpperCase();
              const isAdmin = acc.role?.toLowerCase() === "admin";

              return (
                <tr
                  key={acc.userId}
                  className="transition-colors hover:bg-gray-50/70 dark:hover:bg-slate-800/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b3026] text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#1a1a1a] dark:text-slate-100">
                          {fullName}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                          {acc.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600 whitespace-nowrap dark:text-slate-300">
                    {acc.userId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-slate-200">
                    {acc.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap dark:text-slate-300">
                    {acc.phoneNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleBadge(
                        isAdmin
                      )}`}
                    >
                      {acc.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap dark:text-slate-400">
                    {formatDateTime(acc.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      {onPermissionsClick && (
                        <button
                          type="button"
                          onClick={() => onPermissionsClick(acc)}
                          aria-label={`Change permissions for ${fullName}`}
                          title="Permissions"
                          className={`${iconButton} hover:bg-amber-50 hover:text-amber-600 focus-visible:ring-amber-400/40 dark:hover:bg-amber-500/10 dark:hover:text-amber-400`}
                        >
                          <ShieldCheck size={16} />
                        </button>
                      )}
                      {onPermissionsClick && (
                        <button
                          type="button"
                          onClick={() => onPermissionsClick(acc)}
                          aria-label={`Change permissions for ${fullName}`}
                          title="Permissions"
                          className={`${iconButton} hover:bg-amber-50 hover:text-amber-600 focus-visible:ring-amber-400/40 dark:hover:bg-amber-500/10 dark:hover:text-amber-400`}
                        >
                          <ShieldCheck size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEditClick(acc)}
                        aria-label={`Edit ${fullName}`}
                        title="Edit"
                        className={`${iconButton} hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-blue-400/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(acc._id, fullName)}
                        aria-label={`Delete ${fullName}`}
                        title="Delete"
                        className={`${iconButton} hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-400/40 dark:hover:bg-red-500/10 dark:hover:text-red-400`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
