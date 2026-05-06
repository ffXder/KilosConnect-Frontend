import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ZONES = [
  "Mezzanine", 
  "Powerlifting Area", 
  "Open WOD Area", 
  "CrossFit Area", 
  "Café", 
  "General Storage", 
  "Maintenance Storage"
];

export const AddLoFItemModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    location: ZONES[0], 
    foundBy: "", 
    date: new Date().toISOString().split('T')[0] 
  });

  const isFormValid = 
    formData.name.trim() !== "" && 
    formData.description.trim() !== "" && 
    formData.foundBy.trim() !== "" && 
    formData.date !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-[16px] shadow-xl w-full max-w-[500px] overflow-hidden">
        <div className="bg-[#1e4d46] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Add New Inventory Item</h2>
            <p className="text-white/70 text-sm font-normal opacity-90">Fill in the details to record a found item</p>
          </div>
          <button type="button" onClick={onClose} className="hover:text-white/70 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Item Name *</label>
            <input 
              required 
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              placeholder="e.g. Black Water Bottle" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Description *</label>
            <textarea 
              required 
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal h-24 resize-none focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              placeholder="Include details like brand, color, or markings..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Found In *</label>
              <select 
                required 
                className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal bg-white focus:ring-2 focus:ring-[#1e4d46]/10 outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              >
                {ZONES.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Found By *</label>
              <input 
                required 
                className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
                placeholder="Staff name" 
                value={formData.foundBy}
                onChange={e => setFormData({...formData, foundBy: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Date Found *</label>
            <input 
              required 
              type="date" 
              value={formData.date}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              onChange={e => setFormData({...formData, date: e.target.value})} 
            />
          </div>
          <div className="flex gap-4 pt-4 border-t border-[#f4f5f6]">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#e8e8e8] rounded-[8px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={!isFormValid}
              className={`flex-1 py-3 rounded-[8px] text-sm font-semibold transition-all ${
                isFormValid 
                  ? "bg-[#1e4d46] text-white hover:bg-[#163a35] cursor-pointer shadow-md" 
                  : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
              }`}
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};