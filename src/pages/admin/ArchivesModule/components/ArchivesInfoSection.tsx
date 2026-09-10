import React from "react";

interface ArchivesInfoSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
}

const ArchivesInfoSection: React.FC<ArchivesInfoSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
}) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-[#e2e8f0] flex flex-col sm:flex-row gap-3 items-center mb-6 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
      <div className="relative w-full flex-1">
        <svg
          className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by title, asset, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 bg-white border border-[#e2e8f0] rounded-lg pl-9 pr-3 text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#113e33] transition-all dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-slate-500"
        />
      </div>

      <div className="w-full sm:w-[200px]">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full h-10 bg-white border border-[#e2e8f0] rounded-lg px-3 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#113e33] appearance-none cursor-pointer bg-no-repeat bg-[right_16px_center] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-slate-500"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            backgroundSize: "16px",
          }}
        >
          <option value="All Types">All Types</option>
          <option value="IncidentReport">Incidents</option>
          <option value="Asset">Assets</option>
          <option value="Task">Tasks</option>
          <option value="LostAndFound">Lost & Found</option>
          <option value="User">Users</option>
        </select>
      </div>
    </div>
  );
};

export default ArchivesInfoSection;