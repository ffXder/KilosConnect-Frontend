import React from "react";
import { Plus, Search } from "lucide-react";

interface AccountsFilterSectionProps {
  totalAccounts: number;
  onSearchChange: (value: string) => void;
  onAddNewUser: () => void;
}

export const AccountsFilterSection: React.FC<AccountsFilterSectionProps> = ({
  totalAccounts,
  onSearchChange,
  onAddNewUser,
}) => {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 border-b border-[#eef1f3] md:flex-row md:items-center md:justify-between dark:border-slate-700 transition-color duration-300">
      {/* Title + count */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-slate-100">
          User accounts
        </h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-slate-300">
          {totalAccounts}
        </span>
      </div>

      {/* Search + add, on one row from md up */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search users..."
            autoComplete="off"
            className="h-10 w-full rounded-xl border border-gray-200 bg-[#fafbfc] pl-10 pr-3 text-sm text-slate-900 placeholder:text-gray-400 transition-colors focus:border-[#0b3026] focus:outline-none focus:ring-2 focus:ring-[#0b3026]/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
            onChange={(e) => onSearchChange(e.target.value)}
            // Prevent 'Enter' from triggering parent form submits
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
        </div>

        <button
          type="button" // Explicitly a button to prevent form triggers
          onClick={onAddNewUser}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b3026] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#08241d] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3026]/40 focus-visible:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus-visible:ring-emerald-500/50 dark:focus-visible:ring-offset-slate-900"
        >
          <Plus size={16} />
          Add user
        </button>
      </div>
    </div>
  );
};