import React from 'react';
import { Loader2 } from 'lucide-react';
import type { IncidentReport } from '../../../../types/incident';
import IncidentRow from './IncidentRow';

interface IncidentTableProps {
  incidents: IncidentReport[];
  loading: boolean;
  onSelectIncident: (incident: IncidentReport) => void;
  onViewIncident: (incident: IncidentReport) => void;
  onDeleteIncident: (incident: IncidentReport) => void;
}

const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  loading,
  onSelectIncident,
  onViewIncident,
  onDeleteIncident
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:bg-slate-950 transition-color duration-300 dark:border-slate-600">
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Status</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Severity</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Incident Details</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Description</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Area</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Reported By</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Date & Time</th>
            <th scope="col" className="py-4 px-6 dark:text-slate-300">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm dark:bg-slate-950 transition-color duration-300 dark:divide-slate-800">
          {loading ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
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
                onClick={onSelectIncident}
                onViewClick={onViewIncident}
                onDeleteClick={onDeleteIncident}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                No incidents reported.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;