import React from 'react';
import { Loader2 } from 'lucide-react';
import type { IncidentReport } from '../../../../types/incident';
import IncidentRow from './IncidentRow';

interface IncidentTableProps {
  incidents: IncidentReport[];
  loading: boolean;
  onSelectIncident: (incident: IncidentReport) => void;
  onViewIncident: (incident: IncidentReport) => void;
}

const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  loading,
  onSelectIncident,
  onViewIncident,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <th scope="col" className="py-3 px-4">Status</th>
            <th scope="col" className="py-3 px-4">Severity</th>
            <th scope="col" className="py-3 px-4">Incident Details</th>
            <th scope="col" className="py-3 px-4">Description</th>
            <th scope="col" className="py-3 px-4">Area</th>
            <th scope="col" className="py-3 px-4">Reported By</th>
            <th scope="col" className="py-3 px-4">Date & Time</th>
            <th scope="col" className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
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