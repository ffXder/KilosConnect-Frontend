import React, { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import type { IncidentReport } from '../../types/incident';

interface IncidentAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Omit<IncidentReport, '_id' | 'incidentId' | 'status' | 'reportedBy'>) => void;
}

const IncidentAddItemModal: React.FC<IncidentAddItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('Low');
  const [area, setArea] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [affectedAssets, setAffectedAssets] = useState<string[]>([]);
 
  //validate
  const isFormValid = 
    title.trim() !== '' && 
    area !== '' && 
    dateAndTime !== '';

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({
        title,
        description,
        severity,
        area,
        dateAndTime,
        affectedAssets
      });

     
      setTitle('');
      setDescription('');
      setSeverity('Low');
      setArea('');
      setDateAndTime('');
      setAffectedAssets([]);
      onClose();
    }
  };

  const locations = [
    'Mezzanine', 'Powerlifting Area', 'Open WOD Area', 
    'CrossFit Area', 'Café', 'General Storage', 'Maintenance Storage'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Report New Incident</h2>
            <p className="text-gray-300 text-sm mt-1">Fill in the details to report an equipment issue or safety hazard</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Incident Title *</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#11382C] outline-none" 
              placeholder="Enter incident title" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#11382C] outline-none resize-none" 
              placeholder="Describe the issue in detail..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">Severity *</label>
              <select 
                onChange={(e) => setSeverity(e.target.value as IncidentReport['severity'])}
                value={severity}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>  
              </select>
              <ChevronDown className="absolute right-4 bottom-4 text-gray-400 pointer-events-none" size={18} />
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
              <select 
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none"
              >
                <option value="" disabled>Select zone</option>
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <ChevronDown className="absolute right-4 bottom-4 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date and Time Occurred *</label>
            <input 
              value={dateAndTime}
              onChange={(e) => setDateAndTime(e.target.value)}
              type="datetime-local" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
                isFormValid 
                  ? "bg-[#11382C] text-white hover:bg-[#0a2a21] cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Plus size={18} strokeWidth={3} /> Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentAddItemModal;