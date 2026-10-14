import React from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Search } from "lucide-react";

export type AccountRoleFilter = "all" | "admin" | "custodian";
export type AccountSortField = "name" | "dateAdded";
export type AccountSortDirection = "asc" | "desc";

interface AccountsFilterSectionProps {
  totalAccounts: number;
  onSearchChange: (value: string) => void;
  onAddNewUser: () => void;
  roleFilter: AccountRoleFilter;
  onRoleFilterChange: (role: AccountRoleFilter) => void;
  sortBy: AccountSortField;
  onSortByChange: (sortBy: AccountSortField) => void;
  sortDirection: AccountSortDirection;
  onSortDirectionChange: (direction: AccountSortDirection) => void;
}

export const AccountsFilterSection: React.FC<AccountsFilterSectionProps> = ({
  totalAccounts,
  onSearchChange,
  onAddNewUser,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#eef1f3] dark:border-slate-700">
        <span className="font-semibold text-xl dark:text-slate-100">User Accounts ({totalAccounts})</span>
        <button 
          type="button" // Explicitly button to prevent form triggers
          onClick={onAddNewUser}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b3026] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#08241d] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3026]/40 focus-visible:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus-visible:ring-emerald-500/50 dark:focus-visible:ring-offset-slate-900"
        >
          <Plus size={16} />
          Add user
        </button>
      </div>

      <div className="px-6 py-3">
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />
        <input
          type="search"
          aria-label="Search users"
          placeholder="Search users..."
          autoComplete="off"
          className="w-full h-10 bg-[#fafbfc] border border-gray-200 rounded-lg pl-10 pr-3 text-sm focus:outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
          onChange={(e) => onSearchChange(e.target.value)}
          // Prevent 'Enter' key from triggering parent form submits
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Role:</span>
          <div className="flex gap-1 rounded-[12px] bg-[#f1f5f9] p-1 dark:bg-slate-800">
            {([
              { value: "all", label: "All", active: "bg-slate-200 text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-50", inactive: "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100" },
              { value: "admin", label: "Admin", active: "bg-purple-500 text-white shadow-sm", inactive: "text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/40" },
              { value: "custodian", label: "Custodian", active: "bg-blue-500 text-white shadow-sm", inactive: "text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40" },
            ] as const).map((option) => {
              const isActive = roleFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onRoleFilterChange(option.value)}
                  className={`rounded-[9px] px-4 py-2 text-[12px] font-bold transition-colors ${isActive ? option.active : option.inactive}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="account-sort-by" className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] whitespace-nowrap">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="account-sort-by"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as AccountSortField)}
              className="appearance-none rounded-[12px] border border-[#e2e8f0] bg-white py-2.5 pl-4 pr-10 text-[13px] text-[#1e293b] transition-all hover:border-[#cbd5e1] focus:border-[#113129] focus:outline-none focus:ring-1 focus:ring-[#113129] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="name">Name</option>
              <option value="dateAdded">Date Added</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94a3b8]">
              <ChevronDown size={16} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")}
            aria-label={`Change sort direction, currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
            className="flex items-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#1e293b] hover:border-[#cbd5e1] focus:outline-none focus:ring-1 focus:ring-[#113129] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{sortDirection === "asc" ? "Ascending" : "Descending"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
