import { ArrowDown, ArrowUp, Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedAction: string;
  setSelectedAction: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  startDate?: string;
  setStartDate?: (value: string) => void;
  endDate?: string;
  setEndDate?: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const typeOptions = [
  { label: "All Types", value: "All", active: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50", inactive: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700" },
  { label: "Assets", value: "Asset", active: "bg-blue-100 text-blue-700 ring-1 ring-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800", inactive: "text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40" },
  { label: "Archives", value: "Archive", active: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-800", inactive: "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40" },
  { label: "Task Logs", value: "TaskLog", active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800", inactive: "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40" },
  { label: "Incidents", value: "IncidentReport", active: "bg-red-100 text-red-700 ring-1 ring-red-300 dark:bg-red-950/60 dark:text-red-300 dark:ring-red-800", inactive: "text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40" },
  { label: "Lost & Found", value: "LostAndFound", active: "bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800", inactive: "text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40" },
  { label: "Repair Logs", value: "RepairLog", active: "bg-sky-100 text-sky-700 ring-1 ring-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800", inactive: "text-sky-600 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-950/40" },
  { label: "Tasks", value: "TaskTemplate", active: "bg-violet-100 text-violet-700 ring-1 ring-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-800", inactive: "text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40" },
  { label: "Users", value: "User", active: "bg-slate-200 text-slate-800 ring-1 ring-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600", inactive: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700" },
];

const actions = [
  "CREATE",
  "UPDATE",
  "ARCHIVE",
  "UNARCHIVE",
  "DELETE",
  "CLAIM",
  "UNCLAIM",
  "VIEW",
  "GENERATE",
  "START",
  "COMPLETE",
  "MISSED",
  "VERIFY_PEER",
  "DISPUTE_PEER",
  "RESOLVE_DISPUTE",
  "CANCEL",
];

const selectClass =
  "h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#0f2942] outline-none focus:border-[#0f2942] focus:ring-2 focus:ring-[#0f2942]/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";

export default function LogsFilterSection({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedAction,
  setSelectedAction,
  selectedDate,
  setSelectedDate,
  startDate = "",
  setStartDate,
  endDate = "",
  setEndDate,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by user ID, name, type, action..."
          className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 text-sm text-[#0f2942] outline-none transition-all placeholder:text-gray-400 focus:border-[#0f2942] focus:ring-2 focus:ring-[#0f2942]/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Type:</span>
        {typeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={selectedType === option.value || (option.value === "All" && ["All Types", "All"].includes(selectedType))}
            onClick={() => setSelectedType(option.value)}
            className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
              selectedType === option.value || (option.value === "All" && ["All Types", "All"].includes(selectedType))
                ? option.active
                : option.inactive
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#E5E7EB] pt-3 dark:border-slate-700">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-300">
          Action
          <select value={selectedAction} onChange={(event) => setSelectedAction(event.target.value)} className={selectClass}>
            <option value="All Actions">All Actions</option>
            {actions.map((action) => <option key={action} value={action}>{action.replaceAll("_", " ")}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-300">
          Date range
          <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className={selectClass}>
            <option value="All Dates">All Dates</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Custom">Custom Range</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-300">
          Sort by
          <select aria-label="Sort logs by" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>
            <option value="name">Name</option>
            <option value="date">Date</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"} (currently ${sortOrder === "asc" ? "ascending" : "descending"})`}
          title={`Currently ${sortOrder === "asc" ? "ascending" : "descending"}; click to sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          className={`${selectClass} inline-flex items-center justify-center px-3`}
        >
          {sortOrder === "asc" ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
        </button>
      </div>

      {selectedDate === "Custom" && setStartDate && setEndDate && (
        <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#E5E7EB] pt-3 dark:border-slate-700">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-300">
            From
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={selectClass} />
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-300">
            To
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={selectClass} />
          </label>
        </div>
      )}
    </section>
  );
}
