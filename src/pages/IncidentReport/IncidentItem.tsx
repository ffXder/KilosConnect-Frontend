import React from 'react';
import type { IncidentReport } from '../../types/incident';
import { Eye } from 'lucide-react';
import { formatDateTime } from '../../utils/formatter';

interface IncidentItemProps {
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

const IncidentItem: React.FC<IncidentItemProps> = ({ incident, onClick, onViewClick }) => {
  return (
    <div className="w-full flex items-center border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors group">

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
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-gray-600 border border-gray-300">
            {incident.area}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1 group-hover:text-[#0F6E56] transition-colors">
          {incident.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-[13px] mb-2 line-clamp-1">{incident.description}</p>

        {/* Footer */}
        <div className="flex items-center gap-3 text-[12px] text-gray-400">
          <span>Reported By: {incident.reportedBy?.firstName ?? 'Unknown'} {incident.reportedBy?.lastName ?? ''}</span>
          <span>{formatDateTime(incident.dateAndTime)}</span>
          <span className="text-gray-300">·</span>
          <span>Click to update status</span>
        </div>
      </button>

      {/* Eye button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewClick(incident);
        }}
        className="mr-6 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-[#E1F5EE] hover:text-[#0F6E56] hover:border-[#9FE1CB] transition-all flex-shrink-0"
        title="View Details"
      >
        <Eye size={17} />
      </button>

    </div>
  );
};

export default IncidentItem;