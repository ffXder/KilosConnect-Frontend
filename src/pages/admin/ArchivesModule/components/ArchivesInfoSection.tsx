import React from "react";
import { Search } from "lucide-react";

interface ArchivesInfoSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedDate: string;
  setSelectedDate: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  sortOrder: string;
  setSortOrder: (val: string) => void;
}

const typeOptions = [
  { label: "All Types", value: "All Types", active: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50", inactive: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700" },
  { label: "Incidents", value: "IncidentReport", active: "bg-red-100 text-red-700 ring-1 ring-red-300 dark:bg-red-950/60 dark:text-red-300 dark:ring-red-800", inactive: "text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40" },
  { label: "Tasks", value: "TaskTemplate", active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800", inactive: "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40" },
  { label: "Assets", value: "Asset", active: "bg-sky-100 text-sky-700 ring-1 ring-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800", inactive: "text-sky-600 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-950/40" },
  { label: "Users", value: "User", active: "bg-violet-100 text-violet-700 ring-1 ring-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-800", inactive: "text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40" },
  { label: "Lost & Found", value: "LostAndFound", active: "bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800", inactive: "text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40" },
];

const selectClass =
  "h-10 rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] outline-none focus:border-[#113e33] focus:ring-2 focus:ring-[#113e33]/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

const ArchivesInfoSection: React.FC<ArchivesInfoSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => (
  <section className="space-y-3 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
      <input
        type="text"
        placeholder="Search by title, asset, or ID..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-white pl-9 pr-3 text-sm text-[#0f172a] placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#113e33]/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Type:</span>
      {typeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={selectedType === option.value}
          onClick={() => setSelectedType(option.value)}
          className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
            selectedType === option.value ? option.active : option.inactive
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#e2e8f0] pt-3 dark:border-slate-700">
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
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>
          <option value="name">Name</option>
          <option value="originalDate">Original Date</option>
          <option value="archiveDate">Archived Date</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-300">
        Order
        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className={selectClass}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>

    {selectedDate === "Custom" && (
      <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[#e2e8f0] pt-3 dark:border-slate-700">
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

export default ArchivesInfoSection;
