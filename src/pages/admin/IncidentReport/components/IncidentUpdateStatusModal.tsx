import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Trash2 } from 'lucide-react';
import type { IncidentReport } from '../../../../types/incident';

interface IncidentUpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentReport | null;
  onUpdateStatus: (id: string, newStatus: IncidentReport['status']) => void;
}

const IncidentUpdateStatusModal: React.FC<IncidentUpdateStatusModalProps> = ({ 
  isOpen, 
  onClose, 
  incident, 
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<IncidentReport['status']>('Open');

  useEffect(() => {
    if (incident) setSelectedStatus(incident.status);
  }, [incident]);

  if (!isOpen || !incident) return null;

  const statusOptions: IncidentReport['status'][] = ['Open', 'In Progress', 'Resolved'];
  const statusStyles: Record<IncidentReport['status'], { selected: string; unselected: string }> = {
    Open: {
      selected: 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950/50 dark:text-red-200',
      unselected: 'hover:border-red-200 dark:hover:border-red-800',
    },
    'In Progress': {
      selected: 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-200',
      unselected: 'hover:border-blue-200 dark:hover:border-blue-800',
    },
    Resolved: {
      selected: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200',
      unselected: 'hover:border-emerald-200 dark:hover:border-emerald-800',
    },
  };

  const handleSave = () => {
    onUpdateStatus(incident.incidentId, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Status</h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1">Incident</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">{incident.title}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-300">{incident.area}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Select New Status</p>
            <div className="grid gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedStatus === status
                    ? statusStyles[status].selected
                    : `border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 ${statusStyles[status].unselected}`
                  }`}
                >
                  <span className="font-bold">{status}</span>
                  {selectedStatus === status && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-slate-700">
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-[#11382C] dark:bg-emerald-700 text-white rounded-xl font-bold shadow-lg hover:bg-[#0a2a21] dark:hover:bg-emerald-600">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentUpdateStatusModal;