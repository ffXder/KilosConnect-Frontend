import React from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Search } from "lucide-react";

export type AccountRoleFilter = "all" | "admin" | "custodian" | "super_admin";
export type AccountSortField = "name" | "dateAdded";
export type AccountSortDirection = "asc" | "desc";

interface AccountsFilterSectionProps {
  onSearchChange: (value: string) => void;
  onAddNewUser: () => void;
  roleFilter: AccountRoleFilter;
  onRoleFilterChange: (role: AccountRoleFilter) => void;
  sortBy: AccountSortField;
  onSortByChange: (sortBy: AccountSortField) => void;
  sortDirection: AccountSortDirection;
  onSortDirectionChange: (direction: AccountSortDirection) => void;
}

const roleOptions: Array<{
  value: AccountRoleFilter;
  label: string;
  active: string;
  inactive: string;
}> = [
  {
    value: "all",
    label: "All",
    active: "bg-slate-200 text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-50",
    inactive: "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100",
  },
  {
    value: "admin",
    label: "Admin",
    active: "bg-purple-500 text-white shadow-sm",
    inactive: "text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/40",
  },
  {
    value: "custodian",
    label: "Custodian",
    active: "bg-blue-500 text-white shadow-sm",
    inactive: "text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40",
  },
  {
    value: "super_admin",
    label: "Super admin",
    active: "bg-amber-500 text-white shadow-sm",
    inactive: "text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40",
  },
];

export const AccountsFilterSection: React.FC<AccountsFilterSectionProps> = ({
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
    <div className="border-b border-[#eef1f3] dark:border-slate-700">
      <div className="flex items-center gap-3 p-4">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400"
          />
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search users..."
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-white pl-9 pr-3 text-sm text-[#0f172a] placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#0B4963]/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
          />
        </div>
        <button
          type="button"
          onClick={onAddNewUser}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0B4058] px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#062F41] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#116D8C]/40 dark:bg-[#116D8C] dark:hover:bg-[#0C5673]"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add user</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-5 pb-3 sm:gap-5 sm:px-6 sm:pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] dark:text-slate-300">
            Role:
          </span>
          <div className="flex flex-wrap gap-1 rounded-[12px] bg-[#f1f5f9] p-1 dark:bg-slate-800">
            {roleOptions.map((option) => {
              const isActive = roleFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onRoleFilterChange(option.value)}
                  className={`rounded-[9px] px-3 py-2 text-[12px] font-bold transition-colors sm:px-4 ${
                    isActive ? option.active : option.inactive
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden h-6 w-px bg-gray-200 dark:bg-slate-700 sm:block" />

        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="account-sort-by"
            className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] dark:text-slate-300"
          >
            Sort by:
          </label>
          <div className="relative">
            <select
              id="account-sort-by"
              aria-label="Sort accounts by"
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value as AccountSortField)}
              className="appearance-none rounded-[12px] border border-[#e2e8f0] bg-white py-2.5 pl-4 pr-10 text-[13px] text-[#1e293b] transition-colors hover:border-[#cbd5e1] focus:border-[#116D8C] focus:outline-none focus:ring-1 focus:ring-[#116D8C] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
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
            aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"} (currently ${sortDirection === "asc" ? "ascending" : "descending"})`}
            title={`Currently ${sortDirection === "asc" ? "ascending" : "descending"}; click to change direction`}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e2e8f0] bg-white text-[#1e293b] transition-colors hover:border-[#cbd5e1] focus:outline-none focus:ring-1 focus:ring-[#116D8C] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
