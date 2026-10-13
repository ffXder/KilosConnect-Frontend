import React, { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { useAssets } from '../../../../hooks/useAssets';
import type { NewIncidentReport } from '../../../../types/incident';

interface IncidentAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: NewIncidentReport) => void;
}

const locations = [
  'Mezzanine', 'Powerlifting Area', 'Open WOD Area',
  'CrossFit Area', 'Café', 'General Storage', 'Maintenance Storage'
];

const IncidentAddItemModal: React.FC<IncidentAddItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { assets, loading } = useAssets();

  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<NewIncidentReport['severity']>('Low');
  const [area, setArea] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [asset, setAsset] = useState(''); // single asset _id

  const isFormValid =
    title.trim() !== '' && area !== '' && dateAndTime !== '' && asset !== '';

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmit({
      title,
      description,
      severity,
      area,
      dateAndTime,
      asset
    });

    // Clear all
    setTitle('');
    setDescription('');
    setSeverity('Low');
    setArea('');
    setDateAndTime('');
    setAsset('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Report New Incident</h2>
            <p className="text-gray-300 text-sm mt-1">Fill in the details and select the affected equipment</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-5 overflow-y-auto">
          {/* Incident Title */}
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

          {/* Affected Asset (single) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Affected Asset *</label>
            <div className="relative">
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#11382C]"
                disabled={loading}
              >
                <option value="">{loading ? 'Loading assets...' : 'Select an asset'}</option>
                {assets.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} ({a.assetId})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#11382C] outline-none resize-none"
              placeholder="Describe the issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">Severity *</label>
              <select
                onChange={(e) => setSeverity(e.target.value as NewIncidentReport['severity'])}
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
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
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
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
                isFormValid
                  ? 'bg-[#11382C] text-white hover:bg-[#0a2a21]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
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