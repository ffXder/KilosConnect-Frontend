import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: any) => Promise<void>;
  onSuccess: (task: any) => void;
  initialData?: any; // Crucial for Edit mode
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  onSuccess, 
  initialData 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    area: '',
    frequency: 'Daily',
    dayType: 'Weekday'
  });

  // Effect to handle form state when Modal opens or switches modes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode: Fill form with existing task data
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          startTime: initialData.startTime || '',
          endTime: initialData.endTime || '',
          area: initialData.area || '',
          frequency: initialData.frequency || 'Daily',
          dayType: initialData.dayType || 'Weekday'
        });
      } else {
        // Add Mode: Reset to default empty values
        setFormData({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          area: '',
          frequency: 'Daily',
          dayType: 'Weekday'
        });
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isFormInvalid = !formData.title || !formData.area || !formData.startTime || !formData.endTime || !formData.dayType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // If we are editing, we include the original ID so the backend knows which to update
      const payload = initialData ? { ...formData, _id: initialData._id } : formData;
      
      await onCreate(payload); 
      onSuccess(payload); 
      onClose();
    } catch (error) {
      console.error("Task submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const zones = ["Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Café", "General Storage", "Maintenance Storage"];
  const dayTypes = ["Weekday", "Weekend", "Saturday", "Sunday", "All Days"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        {/* Header - Colors change based on mode */}
        <div className={`${initialData ? 'bg-blue-900' : 'bg-[#06322e]'} p-6 text-white relative`}>
          <h2 className="text-xl font-bold">
            {initialData ? 'Edit Master Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="absolute top-6 right-6 hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Deep Clean Racks"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e] transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Description</label>
            <textarea
              placeholder="Add specific instructions..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e] resize-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Times */}
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

          {/* Area and Day Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Zone / Area *</label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#06322e]"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                <option value="">Select zone</option>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Day Type *</label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#06322e]"
                value={formData.dayType}
                onChange={(e) => setFormData({ ...formData, dayType: e.target.value })}
              >
                {dayTypes.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Frequency Toggle */}
          <div>
            <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Frequency</label>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
              {['Daily', 'Weekly', 'Monthly'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: type })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    formData.frequency === type 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 px-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormInvalid || submitting}
              className={`flex-1 py-4 px-4 rounded-2xl font-bold transition-all shadow-sm ${
                isFormInvalid || submitting 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                  : initialData 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-[#06322e] hover:bg-[#042421] text-white"
              }`}
            >
              {submitting ? "Saving..." : initialData ? "Save Changes" : "+ Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;