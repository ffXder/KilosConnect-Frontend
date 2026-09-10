
interface Props {
  search: string;
  setSearch: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  startDate?: string;
  setStartDate?: (value: string) => void;
  endDate?: string;
  setEndDate?: (value: string) => void;
}

export default function LogsFilterSection({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  startDate = "",
  setStartDate,
  endDate = "",
  setEndDate,
}: Props) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by asset name or ID..."
          className="
            w-full
            sm:flex-1
            h-10
            px-3
            text-sm
            text-[#0f2942]
            placeholder-gray-400
            rounded-lg
            border
            border-[#E5E7EB]
            bg-white
            outline-none
            transition-all
            focus:border-[#0f2942]
            focus:ring-2
            focus:ring-[#0f2942]/10
            dark:bg-slate-800
            dark:border-slate-600
            dark:text-slate-200
            dark:placeholder-slate-400
            dark:focus:border-slate-400
          "
        />

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="
              w-full
              sm:w-40
              h-10
              px-3
              text-sm
              text-[#0f2942]
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              outline-none
              cursor-pointer
              transition-all
              focus:border-[#0f2942]
              focus:ring-2
              focus:ring-[#0f2942]/10
              dark:bg-slate-800
              dark:border-slate-600
              dark:text-slate-200
              dark:focus:border-slate-400
            "
          >
            <option value="All">All Types</option>
            <option value="Asset">Asset</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Incident Report">Incident</option>
            <option value="Lost And Found">Lost & Found</option>
            <option value="TaskLog">Task Log</option>
            <option value="User">User</option>
          </select>

          {/* Date Range Preset Filter */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="
              w-full
              sm:w-40
              h-10
              px-3
              text-sm
              text-[#0f2942]
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              outline-none
              cursor-pointer
              transition-all
              focus:border-[#0f2942]
              focus:ring-2
              focus:ring-[#0f2942]/10
              dark:bg-slate-800
              dark:border-slate-600
              dark:text-slate-200
              dark:focus:border-slate-400
            "
          >
            <option value="All Dates">All Dates</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 days</option>
            <option value="Last 30 Days">Last 30 days</option>
            <option value="Custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Custom Date Pickers (Shown only when "Custom" is selected) */}
      {selectedDate === "Custom" && setStartDate && setEndDate && (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-dashed border-[#E5E7EB] dark:border-slate-700">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium dark:text-slate-300">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
                w-full
                sm:w-auto
                h-10
                px-3
                text-sm
                text-[#0f2942]
                rounded-xl
                border
                border-[#E5E7EB]
                bg-white
                outline-none
                focus:border-[#0f2942]
                dark:bg-slate-800
                dark:border-slate-600
                dark:text-slate-200
                dark:focus:border-slate-400
              "
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium dark:text-slate-300">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="
                w-full
                sm:w-auto
                h-10
                px-3
                text-sm
                text-[#0f2942]
                rounded-xl
                border
                border-[#E5E7EB]
                bg-white
                outline-none
                focus:border-[#0f2942]
                dark:bg-slate-800
                dark:border-slate-600
                dark:text-slate-200
                dark:focus:border-slate-400
              "
            />
          </div>
        </div>
      )}
    </div>
  );
}