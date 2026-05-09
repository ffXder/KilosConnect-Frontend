import React from 'react';
import type { IncidentReport } from '../../types/incident';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react'; // Added Archive icon[cite: 3]

interface IncidentItemProps {
  incident: IncidentReport;
  onClick: (incident: IncidentReport) => void;
}

const IncidentItem: React.FC<IncidentItemProps> = ({ incident, onClick }) => {
  const getStatusConfig = () => {
    switch (incident.status) {
      case 'Open': return { icon: <AlertCircle className="text-red-500" size={20} />, color: 'bg-red-100 text-red-500' };
      case 'In Progress': return { icon: <Clock className="text-blue-500" size={20} />, color: 'bg-blue-100 text-blue-500' };
      case 'Resolved': return { icon: <CheckCircle2 className="text-emerald-500" size={20} />, color: 'bg-emerald-100 text-emerald-500' };
      
    }
  };

  const config = getStatusConfig() ?? { 
    icon: <AlertCircle className="text-gray-400" size={20} />, 
    color: 'bg-gray-100 text-gray-400' 
  };

  return (
    <button 
      onClick={() => onClick(incident)}
      className={`w-full text-left p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors block group`} 
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">{config.icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#11382C] transition-colors">
              {incident.title}
            </h3>
            <span className="text-[10px] font-bold text-gray-400">Click to update status</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">{incident.description}</p>
          
          <div className="flex gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${config.color}`}>
              {incident.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              incident.severity === 'High' ? 'bg-red-50 text-red-400' : 
              incident.severity === 'Medium' ? 'bg-orange-50 text-orange-400' : 'bg-blue-50 text-blue-400'
            }`}>
              {incident.severity}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400">
              {incident.area}
            </span>
          </div>
          
          <p className="text-[10px] text-gray-400">
            Reported by {incident.reportedBy.firstName} • {incident.dateAndTime.toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  );
};

export default IncidentItem;