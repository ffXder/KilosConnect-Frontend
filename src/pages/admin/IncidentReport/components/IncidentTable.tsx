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
    <div className="w-full overflow-x-auto rounded-2xl border border-[#e2e8f0] bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
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
  );
};

export default IncidentTable;