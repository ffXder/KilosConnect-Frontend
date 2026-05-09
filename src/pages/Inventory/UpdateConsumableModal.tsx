import React, { useState, useEffect } from "react";
import { X, Calendar, PackagePlus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: any; // The selected consumable
  onUpdate: (id: string, updates: any) => void;
}

export const UpdateConsumableModal: React.FC<Props> = ({ isOpen, onClose, item, onUpdate }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [restockDate, setRestockDate] = useState("");

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      // Set default date to today
      setRestockDate(new Date().toISOString().split('T')[0]);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    onUpdate(item.consumableId, {
      quantity: Number(quantity),
      lastRestocked: restockDate,
      unit: item.unit
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[450px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#0a2e27]">Update Stock</h3>
              <p className="text-sm text-gray-500 font-medium">{item.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-6 mb-8">
            {/* Quantity Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#0a2e27] uppercase tracking-wider ml-1">
                Current Quantity ({item.unit})
              </label>
              <input 
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-center text-xl font-bold text-[#0a2e27] focus:outline-none focus:border-[#0a2e27]"
              />
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#0a2e27] uppercase tracking-wider ml-1">Restock Date</label>
              <div className="relative">
                <input 
                  type="date"
                  value={restockDate}
                  onChange={(e) => setRestockDate(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27] cursor-pointer" 
                />
                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="p-4 bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl">
               <p className="text-[11px] font-bold text-[#0d9488]">
                 This update will be logged for item: <span className="underline">{item.consumableId}</span>. 
                 The restocking date will be visible on the inventory list.
               </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-3.5 border-2 border-[#e2e8f0] rounded-2xl font-bold text-[#4a5568] hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="flex-[1.5] py-3.5 bg-[#0a2e27] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#0a2e27]/20 flex items-center justify-center gap-2"
            >
              <PackagePlus size={18} />
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};