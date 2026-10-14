import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { IncidentReport } from '../../../../types/incident';
import IncidentRow from './IncidentRow';

interface IncidentTableProps {
  incidents: IncidentReport[];
  highlightedIncidentId?: string | null;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalIncidents: number;
  onPageChange: (page: number) => void;
  onSelectIncident: (incident: IncidentReport) => void;
  onViewIncident: (incident: IncidentReport) => void;
  onDeleteIncident: (incident: IncidentReport) => void;
}

const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  highlightedIncidentId,
  loading,
  currentPage,
  totalPages,
  totalIncidents,
  onPageChange,
  onSelectIncident,
  onViewIncident,
  onDeleteIncident
}) => {
  const [isEditingPage, setIsEditingPage] = React.useState(false);
  const [pageInput, setPageInput] = React.useState('');
  const firstVisiblePage = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => firstVisiblePage + index,
  );

  const commitPageInput = () => {
    const requestedPage = Number(pageInput);
    if (Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= totalPages) {
      onPageChange(requestedPage);
    }
    setIsEditingPage(false);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
              <th scope="col" className="py-4 px-6">Status</th>
              <th scope="col" className="py-4 px-6">Severity</th>
              <th scope="col" className="py-4 px-6">Incident Details</th>
              <th scope="col" className="py-4 px-6">Description</th>
              <th scope="col" className="py-4 px-6">Area</th>
              <th scope="col" className="py-4 px-6">Reported By</th>
              <th scope="col" className="py-4 px-6">Date & Time</th>
              <th scope="col" className="py-4 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm dark:divide-slate-700 dark:bg-slate-900">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400 text-sm dark:text-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Loading incidents...</span>
                  </div>
                </td>
              </tr>
            ) : incidents.length > 0 ? (
              incidents.map((incident) => (
                <IncidentRow
                  key={incident._id}
                  incident={incident}
                  isHighlighted={incident._id === highlightedIncidentId}
                  onClick={onSelectIncident}
                  onViewClick={onViewIncident}
                  onDeleteClick={onDeleteIncident}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400 text-sm dark:text-slate-300">
                  No incidents reported.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!loading && totalIncidents > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e2e8f0] bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs text-gray-500 dark:text-slate-300">
            Showing <span className="font-semibold text-[#0f2942] dark:text-slate-100">{incidents.length}</span>
            {' '}of <span className="font-semibold text-[#0f2942] dark:text-slate-100">{totalIncidents}</span>
            {' '}entries (Page <span className="font-semibold text-[#0f2942] dark:text-slate-100">{currentPage}</span>
            {' '}of <span className="font-semibold text-[#0f2942] dark:text-slate-100">{totalPages}</span>)
          </p>
          <nav className="flex items-center gap-1" aria-label="Incident report pages">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#0f2942] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            {visiblePages.map((pageNumber) =>
              pageNumber === currentPage ? (
                <div key={pageNumber} className="flex flex-col items-center">
                  {isEditingPage ? (
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={pageInput}
                      autoFocus
                      aria-label={`Enter page number, from 1 to ${totalPages}`}
                      onChange={(event) => setPageInput(event.target.value)}
                      onBlur={commitPageInput}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          event.currentTarget.blur();
                        }
                      }}
                      className="h-9 w-9 rounded-lg border border-[#113129] bg-white text-center text-xs font-semibold text-[#113129] outline-none dark:border-emerald-500 dark:bg-slate-800 dark:text-emerald-300"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPageInput(String(currentPage));
                        setIsEditingPage(true);
                      }}
                      aria-current="page"
                      aria-label={`Current page ${currentPage}. Click to enter a page number`}
                      className="h-9 w-9 rounded-lg border border-[#113129] bg-[#113129] text-xs font-semibold text-white dark:border-[#207D55] dark:bg-[#207D55]"
                    >
                      {pageNumber}
                    </button>
                  )}
                  <span className="mt-1 whitespace-nowrap text-[9px] leading-none text-gray-500 dark:text-slate-400">
                    click to enter page
                  </span>
                </div>
              ) : (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  className="h-9 w-9 rounded-lg border border-[#e2e8f0] text-xs font-medium text-[#0f2942] transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#0f2942] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default IncidentTable;