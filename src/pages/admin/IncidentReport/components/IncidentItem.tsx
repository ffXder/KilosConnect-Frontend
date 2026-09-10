import React from 'react';
import type { IncidentReport } from '../../../../types/incident';
import { Eye } from 'lucide-react';
import { formatDateTime } from '../../../../utils/formatter';

interface IncidentItemProps {
  incident: IncidentReport;
  onClick: (incident: IncidentReport) => void;
  onViewClick: (incident: IncidentReport) => void;
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

const IncidentItem: React.FC<IncidentItemProps> = ({ incident, onClick, onViewClick }) => {
  return (
    <div className="w-full flex items-center border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors group dark:border-slate-700 dark:hover:bg-slate-800/80">

      <button
        onClick={() => onClick(incident)}
        className="flex-1 text-left px-7 py-5"
      >
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${statusBadge[incident.status]}`}>
            {incident.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${severityBadge[incident.severity]}`}>
            {incident.severity}
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-gray-600 border border-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600">
            {incident.area}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1 group-hover:text-[#0F6E56] transition-colors dark:text-slate-100 dark:group-hover:text-emerald-300">
          {incident.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-[13px] mb-2 line-clamp-1 dark:text-slate-400">{incident.description}</p>

        {/* Footer */}
        <div className="flex items-center gap-3 text-[12px] text-gray-400 dark:text-slate-400">
          <span>Reported By: {incident.reportedBy?.firstName ?? 'Unknown'} {incident.reportedBy?.lastName ?? ''}</span>
          <span>{formatDateTime(incident.dateAndTime)}</span>
          <span className="text-gray-300 dark:text-slate-500">·</span>
          <span>Click to update status</span>
        </div>
      </button>

      {/* Eye button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewClick(incident);
        }}
        className="mr-6 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-[#E1F5EE] hover:text-[#0F6E56] hover:border-[#9FE1CB] transition-all flex-shrink-0 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-300"
        title="View Details"
      >
        <Eye size={17} />
      </button>

    </div>
  );
};

export default IncidentItem;