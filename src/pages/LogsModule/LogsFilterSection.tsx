interface Props {
  search: string;
  setSearch: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
}

export default function LogsFilterSection({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
}: Props) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[12px] sm:rounded-[20px] p-3 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by asset name or ID..."
          className="
            flex-1
            h-9 sm:h-11
            px-3
            rounded-lg
            border
            border-[#E5E7EB]
            outline-none
            text-[12px] sm:text-sm
          "
        />

        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="
              h-9 sm:h-11
              flex-1 sm:w-[130px]
              rounded-lg
              border
              border-[#E5E7EB]
              px-2 sm:px-4
              text-[12px] sm:text-sm
            "
          >
            <option value="All">All Types</option>
            <option value="Asset">Asset</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Incident">Incident</option>
            <option value="Lost & Found">Lost & Found</option>
            <option value="User">User</option>
          </select>

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="
              h-9 sm:h-11
              flex-1 sm:w-[130px]
              rounded-lg
              border
              border-[#E5E7EB]
              px-2 sm:px-4
              text-[12px] sm:text-sm
            "
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
}

