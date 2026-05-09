import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Trash2 } from 'lucide-react';
import type { IncidentReport } from '../../types/incident';

interface IncidentUpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentReport | null;
  onUpdateStatus: (id: string, newStatus: IncidentReport['status']) => void;
  onDelete: (id: string) => void;
}

const IncidentUpdateStatusModal: React.FC<IncidentUpdateStatusModalProps> = ({ 
  isOpen, 
  onClose, 
  incident, 
  onUpdateStatus,
  onDelete
}) => {
  const [selectedStatus, setSelectedStatus] = useState<IncidentReport['status']>('Open');

  useEffect(() => {
    if (incident) setSelectedStatus(incident.status);
  }, [incident]);

  if (!isOpen || !incident) return null;

  const statusOptions: IncidentReport['status'][] = ['Open', 'In Progress', 'Resolved'];

  const handleSave = () => {
    onUpdateStatus(incident.incidentId, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Status</h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Incident</p>
            <h3 className="text-lg font-bold text-gray-800">{incident.title}</h3>
            <p className="text-sm text-gray-500">{incident.area}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select New Status</p>
            <div className="grid gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedStatus === status 
                    ? 'border-[#11382C] bg-[#11382C]/5 text-[#11382C]' 
                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span className="font-bold">{status}</span>
                  {selectedStatus === status && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3 border-t border-gray-100">
            {/* Archive Button[cite: 5] */}
            <button 
              onClick={() => {
                onDelete(incident.incidentId);
                onClose()
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
            >
              <Trash2 size={18} />
              Delete
            </button>
            
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-[#11382C] text-white rounded-xl font-bold shadow-lg hover:bg-[#0a2a21]">
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