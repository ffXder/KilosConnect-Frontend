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
    <div className="border-b border-[#eef1f3] dark:border-slate-700">
      <div className="flex items-center justify-between gap-4 border-b border-[#eef1f3] px-5 py-4 dark:border-slate-700 sm:px-6">
        <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-slate-100">
          User Accounts ({totalAccounts})
        </h2>
        <button
          type="button"
          onClick={onAddNewUser}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#002B38] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#062F41] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#002B38]/40 focus-visible:ring-offset-2 dark:bg-sky-700 dark:hover:bg-sky-600 dark:focus-visible:ring-sky-500/50 dark:focus-visible:ring-offset-slate-900"
        >
          <Plus size={16} />
          Add user
        </button>
      </div>

      <div className="px-5 py-2.5 sm:px-6">
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"
          />
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search users..."
            autoComplete="off"
            className="h-9 w-full rounded-lg border border-gray-200 bg-[#fafbfc] pl-9 pr-3 text-sm text-slate-900 placeholder:text-gray-400 transition-colors focus:border-[#126F91] focus:outline-none focus:ring-2 focus:ring-[#126F91]/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
        </div>
      </div>
    </div>
  );
};
