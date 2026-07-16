import React, { useState, useEffect } from "react";
import { X, ChevronDown, ClipboardEdit } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
  onUpdate: (id: string, updates: any) => void;
}

export const UpdateAssetModal: React.FC<Props> = ({ isOpen, onClose, asset, onUpdate }) => {
  const [condition, setCondition] = useState("");
  const [updateNote, setUpdateNote] = useState("");

  useEffect(() => {
    if (asset) {
      setCondition(asset.status || "Working");
      setUpdateNote(asset.description || "");
    }
  }, [asset, isOpen]);

  if (!isOpen || !asset) return null;

  const conditions = ["Working", "Damaged", "Under Repair", "Hazardous"];

  const handleSave = () => {
    onUpdate(asset.assetId, {
      condition: condition,
      description: updateNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden">
        <div className="bg-[#0a2e27] p-6 flex justify-between items-start text-white">
          <div>
            <h2 className="text-xl font-bold">Update Asset Status</h2>
            <p className="text-white/70 text-xs mt-0.5">Editing: {asset.name} ({asset.assetId})</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#4a5568]">Asset Status</label>
            <div className="relative">
              <select 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] appearance-none focus:outline-none focus:border-[#0a2e27] cursor-pointer font-bold"
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#4a5568]">Notes / Update Description</label>
            <textarea 
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              rows={4}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27] resize-none" 
              placeholder="Describe repairs, checks or physical conditions..." 
            />
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
            <ClipboardEdit className="text-blue-500 shrink-0" size={20} />
            <p className="text-[11px] font-medium text-blue-700">
              Modifying registry values immediately propagates through live analytical widgets.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 border-2 border-[#e2e8f0] rounded-2xl font-bold text-[#4a5568] hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={handleSave} className="flex-1 py-3.5 bg-[#0a2e27] text-white rounded-2xl font-bold shadow-lg hover:bg-[#08241f]">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};