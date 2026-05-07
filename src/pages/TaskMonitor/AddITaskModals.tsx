import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: any) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    area: '',
    frequency: 'Daily' 
  });

  if (!isOpen) return null;

  const isFormInvalid = !formData.title || !formData.area || !formData.startTime || !formData.endTime;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      onSuccess({
        ...formData,
        _id: Math.random().toString(36).substr(2, 9),
        status: 'Pending',
        isArchived: false
      });
      setSubmitting(false);
      onClose();
      setFormData({ title: '', description: '', startTime: '', endTime: '', area: '', frequency: 'Daily' });
    }, 500);
  };

  const zones = ["Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Café", "General Storage", "Maintenance Storage"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-[#06322e] p-6 text-white relative">
          <h2 className="text-xl font-bold">Add New Task</h2>
          <button onClick={onClose} className="absolute top-6 right-6 hover:bg-white/10 p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Deep Clean Racks"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e]"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* New Description Field */}
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2">Description</label>
            <textarea
              placeholder="Add specific instructions or notes here..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1e293b] mb-2">Start Time *</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e]"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1e293b] mb-2">End Time *</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e]"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2">Zone / Area *</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            >
              <option value="">Select zone</option>
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2">Task Type</label>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
              {['Daily', 'Weekly', 'Monthly'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: type })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    formData.frequency === type ? "bg-[#a855f7] text-white shadow-md" : "text-gray-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-bold text-gray-500">Cancel</button>
            <button
              type="submit"
              disabled={isFormInvalid || submitting}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-sm ${
                isFormInvalid || submitting ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#06322e] hover:bg-[#042421] text-white"
              }`}
            >
              {submitting ? "Saving..." : "+ Add to Task List"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;