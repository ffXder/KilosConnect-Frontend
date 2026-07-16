import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const ArchiveConfirmModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl overflow-hidden p-8 text-center">
        <div className="flex justify-end -mt-4 -mr-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>

        <h3 className="text-2xl font-black text-[#1f1f1f] mb-2">Archive Asset?</h3>
        <p className="text-gray-400 font-medium mb-8">
          Are you sure you want to archive <span className="text-[#1f1f1f] font-bold">"{itemName}"</span>? This action removes it from the asset catalog[cite: 6].
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg"
          >
            Yes, Archive Asset
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            Keep Asset
          </button>
        </div>
      </div>
    </div>
  );
};