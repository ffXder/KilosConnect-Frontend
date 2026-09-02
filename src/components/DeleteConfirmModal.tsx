import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called on confirm. Passes the optional reason string if provided.
   */
  onConfirm: (reason?: string) => void;
  itemName: string;
  /**
   * Entity type for title and copy (e.g., "Asset", "Incident", "Task", "User")
   * @default "Record"
   */
  itemType?: string;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "Record",
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 dark:bg-slate-950 dark:border-slate-600">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 dark:border-red-500 dark:text-red-200 dark:bg-red-500">
            <Trash2 size={20} />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleConfirm} className="px-6 pb-6">
          <div className="text-left mt-2">
            <h3 className="text-xl font-bold text-slate-900 leading-tight dark:text-slate-50 ">
              Delete {itemType}?
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed dark:text-slate-300">
              Are you sure you want to delete{" "}
              <span className="text-slate-900 font-semibold break-words dark:text-slate-50 font-bold">
                "{itemName}"
              </span>
              ? This item will be removed from your active workspace.
            </p>
          </div>

          {/* Optional Reason Field */}
          <div className="mt-4 text-left">
            <label className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider dark:text-slate-300">
              <span>Reason for deletion</span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">
                (optional)
              </span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Damaged beyond repair, duplicate entry, obsolete..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 dark:bg-slate-900 hover:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                `Delete ${itemType}`
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};