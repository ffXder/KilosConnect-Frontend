import React from 'react';
import type { IncidentReport } from '../../../../types/incident';
import { Edit3, Trash2, MapPin } from 'lucide-react';
import { formatDateTime } from '../../../../utils/formatter';

interface IncidentRowProps {
  incident: IncidentReport;
  onClick: (incident: IncidentReport) => void;
  onViewClick: (incident: IncidentReport) => void;
  onDeleteClick: (incident: IncidentReport) => void;
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

const IncidentRow: React.FC<IncidentRowProps> = ({ incident, onClick, onViewClick, onDeleteClick }) => {
  return (
    <tr
      onClick={() => onViewClick(incident)}
      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] cursor-pointer transition-colors group text-[13px] last:border-b-0"
    >
      {/* ID */}
      <td className="py-4 px-6">
        <div className="text-xs text-gray-900 mt-0.5 dark:text-slate-400">
          {incident.incidentId}
          </div>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[incident.status] || 'bg-gray-100 text-gray-700'}`}>
          {incident.status}
        </span>
      </td>

      {/* Severity */}
      <td className="py-4 px-6">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${severityBadge[incident.severity] || 'bg-gray-100 text-gray-700'}`}>
          {incident.severity}
        </span>
      </td>

      {/* Title & Description */}
      <td className="py-4 px-6">
        <div className="font-semibold text-gray-900 group-hover:text-[#0F6E56] transition-colors truncate">
          {incident.title}
        </div>
        <div className="text-gray-400 text-[12px] truncate">
          {incident.description}
        </div>
      </td>

      {/* Area */}
      <td className="py-4 px-6 text-gray-500 font-medium">
        <div className="flex items-center gap-1.5 dark:text-slate-300">
          <MapPin size={14} className="text-gray-400 dark:text-slate-300" />
            {incident.area}
        </div>
      </td>

      {/* Reported By */}
      <td className="py-4 px-6">
        {incident.reportedBy?.firstName ?? 'Unknown'} {incident.reportedBy?.lastName ?? ''}
      </td>

      {/* Date */}
      <td className="py-4 px-6 text-[12px]">
        {formatDateTime(incident.dateAndTime)}
      </td>

      {/* Actions */}
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(incident)}
            }
            className="text-blue-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors"
            title="Edit Asset"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(incident)}
            }
            className="text-red-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
            title="Delete Asset"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default IncidentRow;