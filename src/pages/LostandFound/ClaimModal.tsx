import React, { useState, useRef } from 'react';
import { X, CheckCircle, ImagePlus } from 'lucide-react';

interface ClaimModalProps {
  itemName: string;
  onClose: () => void;
  onConfirm: (claimedBy: string, imageFile: File) => void; // ← simplified, removed claimedDate since backend sets claimedAt itself
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ itemName, onClose, onConfirm }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [claimedBy, setClaimedBy] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);     
  const [imagePreview, setImagePreview] = useState<string | null>(null); 

  const isFormValid = claimedBy.trim() !== ""; 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);                              
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && imageFile) {
      onConfirm(claimedBy, imageFile); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-[16px] shadow-xl w-full max-w-[500px] overflow-hidden">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Mark as Claimed</h2>
            <p className="text-white/70 text-sm font-normal opacity-90">Recording claim details for: {itemName}</p>
          </div>
          <button type="button" onClick={onClose} className="hover:text-white/70 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Claimed By (Full Name) <span className="text-red-500">*</span>
            </label>
            <input 
              required 
              autoFocus
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[8px] text-sm font-normal focus:ring-2 focus:ring-[#1e4d46]/10 outline-none" 
              placeholder="e.g. Robert Fox" 
              value={claimedBy}
              onChange={e => setClaimedBy(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Proof of Claim / Claimant Photo <span className="text-red-500">*</span> {/* ← now required */}
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
                  <img src={imagePreview} alt="Claimant Preview" className="w-12 h-12 rounded-[6px] object-cover" />
                  <span className="text-xs text-gray-500 font-medium">{imageFile?.name}</span>
                </div>
              ) : (
                <>
                  <ImagePlus size={24} className="text-[#94a3b8] mb-2" />
                  <p className="text-[13px] font-medium text-gray-700">Click to upload claimant photo</p>
                  <p className="text-[11px] text-gray-400">Required for verification</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#f4f5f6]">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border border-[#e8e8e8] rounded-[8px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid}
              className={`flex-1 py-3 rounded-[8px] text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isFormValid 
                  ? "bg-[#1e4d46] text-white hover:bg-[#163a35] cursor-pointer shadow-md" 
                  : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
              }`}
            >
              <CheckCircle size={18} />
              Confirm Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};