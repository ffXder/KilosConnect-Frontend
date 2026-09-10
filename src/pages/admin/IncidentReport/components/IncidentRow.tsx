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
  'Open':        'bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1] dark:bg-[#3d1b1b] dark:text-[#fca5a5] dark:border-[#7f1d1d]',
  'In Progress': 'bg-[#E6F1FB] text-[#185FA5] border border-[#B5D4F4] dark:bg-[#112a46] dark:text-[#93c5fd] dark:border-[#1d4ed8]',
  'Resolved':    'bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97] dark:bg-[#1e3a2c] dark:text-[#a7f3d0] dark:border-[#166534]',
};

const severityBadge: Record<string, string> = {
  'Critical': 'bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1] dark:bg-[#3d1b1b] dark:text-[#fca5a5] dark:border-[#7f1d1d]',
  'Urgent':   'bg-[#FAEEDA] text-[#854F0B] border border-[#FAC775] dark:bg-[#3f2c15] dark:text-[#fcd34d] dark:border-[#b45309]',
  'High':     'bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1] dark:bg-[#3d1b1b] dark:text-[#fca5a5] dark:border-[#7f1d1d]',
  'Medium':   'bg-[#FAEEDA] text-[#854F0B] border border-[#FAC775] dark:bg-[#3f2c15] dark:text-[#fcd34d] dark:border-[#b45309]',
  'Low':      'bg-[#E6F1FB] text-[#185FA5] border border-[#B5D4F4] dark:bg-[#112a46] dark:text-[#93c5fd] dark:border-[#1d4ed8]',
};

const IncidentRow: React.FC<IncidentRowProps> = ({ incident, onClick, onViewClick, onDeleteClick }) => {
  return (
    <tr
      onClick={() => onViewClick(incident)}
      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] cursor-pointer transition-colors group text-[13px] last:border-b-0 dark:border-slate-700 dark:hover:bg-slate-800/80"
    >
      {/* ID */}
      <td className="py-4 px-6">
        <div className="text-xs text-gray-900 mt-0.5 dark:text-slate-300">
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
        <div className="font-semibold text-gray-900 group-hover:text-[#0F6E56] transition-colors truncate dark:text-slate-100 dark:group-hover:text-emerald-300">
          {incident.title}
        </div>
        <div className="text-gray-400 text-[12px] truncate dark:text-slate-400">
          {incident.description}
        </div>
      </td>

      {/* Area */}
      <td className="py-4 px-6 text-gray-500 font-medium">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-300">
          <MapPin size={14} className="text-gray-400 dark:text-slate-400" />
            {incident.area}
        </div>
      </td>

      {/* Reported By */}
      <td className="py-4 px-6 text-gray-700 dark:text-slate-200">
        {incident.reportedBy?.firstName ?? 'Unknown'} {incident.reportedBy?.lastName ?? ''}
      </td>

      {/* Date */}
      <td className="py-4 px-6 text-[12px] text-gray-600 dark:text-slate-300">
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
            className="text-blue-500 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors dark:hover:bg-slate-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="Edit Asset"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(incident)}
            }
            className="text-red-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors dark:hover:bg-slate-700 dark:text-red-400 dark:hover:text-red-300"
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