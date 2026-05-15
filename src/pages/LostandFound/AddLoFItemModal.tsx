import React, { useState, useRef } from 'react';
import { X, ImagePlus } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: any, imageFile: File) => void; // ← added imageFile
}

const Areas = [
  "Mezzanine", 
  "Powerlifting Area", 
  "Open WOD Area", 
  "CrossFit Area", 
  "Weightlifting Area", 
  "General Storage", 
  "Maintenance Storage"
];

export const AddLoFItemModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ 
    item: "", 
    description: "", 
    areaFound: Areas[0], 
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);       // ← actual File
  const [imagePreview, setImagePreview] = useState<string | null>(null); // ← just for preview

  const isFormValid = 
    formData.item.trim() !== "" && 
    formData.date !== "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !imageFile || isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit(formData, imageFile);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-[16px] shadow-xl w-full max-w-[500px] overflow-hidden">
        <div className="bg-[#1C2D24] p-6 text-[#FDFFE0] flex justify-between items-center">
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
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input 
              required 
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              placeholder="e.g. Black Water Bottle" 
              value={formData.item}
              onChange={e => setFormData({...formData, item: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Description
            </label>
            <textarea 
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal h-24 resize-none focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              placeholder="Include details like brand, color, or markings..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                Found In <span className="text-red-500">*</span>
              </label>
              <select 
                required 
                className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal bg-white focus:ring-2 focus:ring-[#1e4d46]/10 outline-none"
                value={formData.areaFound}
                onChange={e => setFormData({...formData, areaFound: e.target.value})}
              >
                {Areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Found Item Photo <span className="text-red-500">*</span> {/* ← now required */}
            </label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#e8e8e8] rounded-[12px] p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-[#fcfcfc]"
            >
              {imagePreview ? (
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-[6px] object-cover" />
                  <span className="text-xs text-gray-500 font-medium">{imageFile?.name}</span>
                </div>
              ) : (
                <>
                  <ImagePlus size={24} className="text-[#94a3b8] mb-2" />
                  <p className="text-[13px] font-medium text-gray-700">Drag & drop or click to upload</p>
                  <p className="text-[11px] text-gray-400">Maximum file size: 5MB</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Date Found <span className="text-red-500">*</span>
            </label>
            <input 
              required 
              type="date" 
              value={formData.date}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              onChange={e => setFormData({...formData, date: e.target.value})} 
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#f4f5f6]">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#e8e8e8] rounded-[8px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className={`flex-1 py-3 rounded-[8px] text-sm font-semibold transition-all ${
                  isFormValid && !isSubmitting
                      ? "bg-[#d86125] text-[#FDFFE0] hover:bg-[#ba6300] cursor-pointer shadow-md" 
                      : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
              }`}
          >
              {isSubmitting ? "Adding..." : "Add to Inventory"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};