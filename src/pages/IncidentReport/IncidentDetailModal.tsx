import React from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  FileText,
  Package, 
  Activity 
} from 'lucide-react';
import type { IncidentReport } from '../../types/incident';
import { formatDateTime } from '../../utils/formatter';

interface IncidentDetailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentReport | null;
}

const IncidentDetailedModal: React.FC<IncidentDetailedModalProps> = ({ isOpen, onClose, incident }) => {
  if (!isOpen || !incident) return null;

  const getStatusConfig = () => {
    switch (incident.status) {
      case 'Open': 
        return { icon: <AlertCircle size={20} />, color: 'bg-red-50 text-red-600 border-red-100', label: 'Pending' };
      case 'In Progress': 
        return { icon: <Clock size={20} />, color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'In Progress' };
      case 'Resolved': 
        return { icon: <CheckCircle2 size={20} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Resolved' };
      default:
        return { icon: <AlertCircle size={20} />, color: 'bg-gray-50 text-gray-600 border-gray-100', label: 'Unknown' };
    }
  };

  const getSeverityStyle = (severity: string) => {
    if (severity.includes('Critical') || severity.includes('Urgent') || severity.includes('High')) return 'text-red-600 bg-red-50';
    if (severity.includes('Medium')) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  // Helper to color-code asset condition
  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case 'Good Condition': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Needs Repair': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Needs Replacement': return 'text-red-600 bg-red-50 border-red-100';
      case 'Under Repair': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const status = getStatusConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#11382C] p-8 text-white flex justify-between items-start shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Incident Report</span>
              <span className="text-[10px] text-white/40">•</span>
              <span className="text-[10px] font-mono text-white/80">ID: {incident.incidentId}</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">{incident.title}</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <FileText size={16} />
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.1em]">Description</h4>
                </div>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100 italic">
                  {incident.description || "No description provided."}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-100 bg-white">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <BarChart3 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Severity</span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getSeverityStyle(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 bg-white">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    {status.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Metadata */}
            <div className="space-y-6 bg-[#F8FAFC] p-6 rounded-3xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <MapPin size={20} className="text-[#11382C]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                  <p className="font-bold text-gray-800">{incident.area}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <User size={20} className="text-[#11382C]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reported By</p>
                  <p className="font-bold text-gray-800">
                    {incident.reportedBy?.firstName} {incident.reportedBy?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <Calendar size={20} className="text-[#11382C]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Reported</p>
                  <p className="font-bold text-gray-800">{formatDateTime(incident.dateAndTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Affected Assets Details */}
          {incident.affectedAssets && incident.affectedAssets.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Package size={16} />
                <h4 className="text-[11px] font-bold uppercase tracking-[0.1em]">Affected Assets Detail</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {incident.affectedAssets.map((asset: any) => (
                  <div key={asset._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#11382C]/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#11382C]/5 flex items-center justify-center text-[#11382C]">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{asset.name}</p>
                        <p className="text-[10px] font-mono text-gray-400">{asset.assetId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-[#11382C] text-white rounded-xl font-bold shadow-lg hover:bg-[#0a2a21] transition-all active:scale-95"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailedModal;