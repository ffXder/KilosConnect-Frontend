import React from 'react';

interface Props {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const LogsFilterSection: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All Logs', 'Inventory', 'Tasks', 'Incidents', 'Lost & Found'];

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200
              ${isActive
                ? 'bg-[#1a3d3a] text-white shadow-sm'
                : 'bg-[#f1f4f9] text-[#7d8da1] hover:bg-[#e2e8f0]'
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};