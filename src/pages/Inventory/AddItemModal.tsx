import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (item: any) => void;
}

export const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  // 1. STATE MANAGEMENT
  const [category, setCategory] = useState<"Consumables" | "Assets">("Consumables");
  const [formData, setFormData] = useState({
    id: "", // Added ID field
    name: "",
    description: "",
    quantity: 0,
    zone: "",
    minQuantity: 0,
    unit: "",
    purchaseDate: ""
  });

  // Reset fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: "", // Reset ID
        name: "",
        description: "",
        quantity: 0,
        zone: "",
        minQuantity: 0,
        unit: "",
        purchaseDate: ""
      });
      setCategory("Consumables");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let finalValue: string | number = value;
    if (name === "quantity" || name === "minQuantity") {
      finalValue = Math.max(0, Number(value));
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.zone) {
      alert("Please fill in the required fields (Name and Zone)");
      return;
    }

    const newItem = {
      ...formData,
      category,
      // Map the user input 'id' to the specific fields used by InventoryList
      consumableId: formData.id, 
      assetId: formData.id,
      createdAt: new Date().toISOString()
    };

    console.log("New Item Data:", newItem);
    if (onAdd) onAdd(newItem);
    
    onClose();
  };

  const zones = [
    "Mezzanine", 
    "Powerlifting Area", 
    "Open WOD Area", 
    "CrossFit Area", 
    "Weightlifting Area", 
    "General Storage", 
    "Maintenance Storage"
  ];

  const units = ["liters", "pcs", "box", "pack", "bottle", "can", "other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[540px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#0a2e27] p-6 flex justify-between items-start text-white">
          <div>
            <h2 className="text-xl font-bold">Add New Item</h2>
            <p className="text-white/70 text-xs mt-0.5">Fill in the details to add an item</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#4a5568]">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27]" 
              placeholder="e.g. Magnesium Chalk" 
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#4a5568]">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27] resize-none" 
              placeholder="Brief details about the item..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#4a5568]">Current Quantity</label>
              <input 
                name="quantity"
                type="number" 
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" 
              />
            </div>
            {/* Zone */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#4a5568]">Zone / Area</label>
              <div className="relative">
                <select 
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] appearance-none focus:outline-none focus:border-[#0a2e27] cursor-pointer"
                >
                  <option value="" disabled>Select zone</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Asset Specific: Purchase Date */}
          {category === "Assets" && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#4a5568]">Purchase Date</label>
                <input 
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27]" 
                />
              </div>
              <div className="flex items-end text-[10px] text-gray-400 pb-3">
                Tracking asset lifecycle
              </div>
            </div>
          )}

          {/* Consumable Specific: Min Qty and Unit */}
          {category === "Consumables" && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#4a5568]">Minimum Quantity</label>
                <input 
                  name="minQuantity"
                  type="number" 
                  min="0"
                  value={formData.minQuantity}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#4a5568]">Unit</label>
                <div className="relative">
                  <select 
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] appearance-none focus:outline-none focus:border-[#0a2e27] cursor-pointer"
                  >
                    <option value="" disabled>Select unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Category Switcher */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#4a5568]">Inventory Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setCategory("Consumables")}
                className={`py-3.5 rounded-2xl border-2 font-bold transition-all ${
                  category === "Consumables" 
                    ? "bg-[#d86125] text-[#FDFFE0] border-[#ba6300] shadow-lg" 
                    : "border-[#e2e8f0] text-[#4a5568] hover:bg-gray-50"
                }`}
              >
                Consumables
              </button>
              <button 
                type="button"
                onClick={() => setCategory("Assets")}
                className={`py-3.5 rounded-2xl border-2 font-bold transition-all ${
                  category === "Assets" 
                    ? "bg-[#d86125] text-[#FDFFE0] border-[#ba6300] shadow-lg" 
                    : "border-[#e2e8f0] text-[#4a5568] hover:bg-gray-50"
                }`}
              >
                Assets
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl">
            <h4 className="text-[11px] font-black text-[#0a2e27] uppercase">Make sure to:</h4>
            <ul className="text-[10px] font-bold text-[#0d9488] list-disc list-inside mt-0.5">
              <li>Double-check item details</li>
              <li>Set minimum quantity for alerts</li>
            </ul>
          </div>

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
              onClick={handleSubmit}
              className="flex-1 py-3.5 bg-[#0a2e27] text-white rounded-2xl font-bold shadow-lg hover:bg-[#08241f] transition-all"
            >
              + Add to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};