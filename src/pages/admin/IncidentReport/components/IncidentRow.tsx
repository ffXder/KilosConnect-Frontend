import React from 'react';
import type { IncidentReport } from '../../../../types/incident';
import { Eye } from 'lucide-react';
import { formatDateTime } from '../../../../utils/formatter';

interface IncidentRowProps {
  incident: IncidentReport;
  onClick: (incident: IncidentReport) => void;
  onViewClick: (incident: IncidentReport) => void;
}

const statusBadge: Record<string, string> = {
  'Open':        'bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1]',
  'In Progress': 'bg-[#E6F1FB] text-[#185FA5] border border-[#B5D4F4]',
  'Resolved':    'bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97]',
};

const severityBadge: Record<string, string> = {
  'Critical': 'bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1]',
  'Urgent':   'bg-[#FAEEDA] text-[#854F0B] border border-[#FAC775]',
  'High':     'bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1]',
  'Medium':   'bg-[#FAEEDA] text-[#854F0B] border border-[#FAC775]',
  'Low':      'bg-[#E6F1FB] text-[#185FA5] border border-[#B5D4F4]',
};

const IncidentRow: React.FC<IncidentRowProps> = ({ incident, onClick, onViewClick }) => {
  return (
    <tr
      onClick={() => onClick(incident)}
      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] cursor-pointer transition-colors group text-[13px] last:border-b-0"
    >
      {/* ID */}
      <td className="py-3 px-4 whitespace-nowrap">
        {incident.incidentId}
      </td>

      {/* Status */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[incident.status] || 'bg-gray-100 text-gray-700'}`}>
          {incident.status}
        </span>
      </td>

      {/* Severity */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${severityBadge[incident.severity] || 'bg-gray-100 text-gray-700'}`}>
          {incident.severity}
        </span>
      </td>

      {/* Title & Description */}
      <td className="py-3 px-4 max-w-sm">
        <div className="font-semibold text-gray-900 group-hover:text-[#0F6E56] transition-colors truncate">
          {incident.title}
        </div>
        <div className="text-gray-400 text-[12px] truncate">
          {incident.description}
        </div>
      </td>

      {/* Area */}
      <td className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-gray-600 border border-gray-300">
          {incident.area}
        </span>
      </td>

      {/* Reported By */}
      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
        {incident.reportedBy?.firstName ?? 'Unknown'} {incident.reportedBy?.lastName ?? ''}
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-gray-400 whitespace-nowrap text-[12px]">
        {formatDateTime(incident.dateAndTime)}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewClick(incident);
          }}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-[#E1F5EE] hover:text-[#0F6E56] hover:border-[#9FE1CB] transition-all"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
};

export default IncidentRow;