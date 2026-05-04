import React, { useState } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react";
import type { InventoryItemData ,EquipmentAsset } from "../../types/inventory";

interface Props {
  onClose: () => void;
  onAddConsumable: (data: Partial<InventoryItemData>) => Promise<void>;
  onAddAsset: (data: Partial<EquipmentAsset>) => Promise<void>;
}

type ItemType = "Consumable" | "Asset"

export const AddItemModal: React.FC<Props> = ({ onClose, onAddConsumable, onAddAsset }) => {
  const [itemType, setItemType] = useState<ItemType>("Consumable");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
 
  // Consumable fields
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState(10);
  const [unit, setUnit] = useState("pcs");
 
  // Asset fields
  const [condition, setCondition] = useState<EquipmentAsset["condition"]>("Working");
  const [area, setArea] = useState("");
 
  const handleSubmit = async () => {
    if (!name.trim()) {
      setFormError("Item name is required.");
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      if (itemType === "Consumable") {
        await onAddConsumable({ name, quantity, location, lowStockAlert, unit, type: "Consumable" });
      } else {
        await onAddAsset({ name, condition, area, type: "Asset" });
      }
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add item.");
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[540px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#0a2e27] p-8 flex justify-between items-start text-white">
          <div>
            <h2 className="text-2xl font-bold">Add New Item</h2>
            <p className="text-white/70 text-sm mt-1">Fill in the details to add an item</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={28} />
          </button>
        </div>
 
        <div className="p-10 space-y-6">
          {/* Type toggle */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#4a5568]">Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              {(["Consumable", "Asset"] as ItemType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setItemType(t)}
                  className={`py-4 rounded-2xl border-2 font-bold transition-colors ${
                    itemType === t
                      ? "bg-[#0a2e27] text-white border-[#0a2e27] shadow-lg"
                      : "border-[#e2e8f0] text-[#4a5568] hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
 
          {/* Item Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#4a5568]">Item Name <span className="text-red-500">*</span></label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] focus:outline-none focus:border-[#0a2e27]"
              placeholder="e.g. Magnesium Chalk"
            />
          </div>
 
          {/* Consumable fields */}
          {itemType === "Consumable" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Current Quantity</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Unit</label>
                  <input value={unit} onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]"
                    placeholder="pcs, boxes, bottles..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Minimum Quantity</label>
                  <input type="number" value={lowStockAlert} onChange={(e) => setLowStockAlert(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a5568]">Location</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]"
                    placeholder="e.g. Maintenance Supplies" />
                </div>
              </div>
            </>
          )}
 
          {/* Asset fields */}
          {itemType === "Asset" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4a5568]">Condition</label>
                <div className="relative">
                  <select value={condition} onChange={(e) => setCondition(e.target.value as EquipmentAsset["condition"])}
                    className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f] appearance-none focus:outline-none focus:border-[#0a2e27]">
                    <option>Working</option>
                    <option>Damaged</option>
                    <option>Need Repair</option>
                    <option>Under Repair</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4a5568]">Area</label>
                <input value={area} onChange={(e) => setArea(e.target.value)}
                  className="w-full px-5 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl text-[#1f1f1f]"
                  placeholder="e.g. Open WOD Area" />
              </div>
            </div>
          )}
 
          {/* Error */}
          {formError && (
            <p className="text-sm font-bold text-red-500 bg-red-50 px-4 py-3 rounded-xl">{formError}</p>
          )}
 
          <div className="p-5 bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl space-y-1">
            <h4 className="text-[12px] font-black text-[#0a2e27] uppercase">Make sure to:</h4>
            <ul className="text-[11px] font-bold text-[#0d9488] list-disc list-inside space-y-1">
              <li>Double-check the item details before adding</li>
              <li>Set appropriate minimum quantity for reorder alerts</li>
            </ul>
          </div>
 
          <div className="flex gap-4 pt-4">
            <button onClick={onClose} disabled={submitting}
              className="flex-1 py-4 border-2 border-[#e2e8f0] rounded-2xl font-bold text-[#4a5568] hover:bg-gray-50 transition-all disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-4 bg-[#0a2e27] text-white rounded-2xl font-bold shadow-lg hover:bg-[#08241f] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Adding...</> : "+ Add to Inventory"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
