import React from "react";
import type { ArchiveRecord } from "../../../../types/archive";

interface ArchiveDetailsModalProps {
  item: ArchiveRecord | null;
  onClose: () => void;
}

export const ArchiveDetailsModal: React.FC<ArchiveDetailsModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  const itemTitle =
    item.data?.title ||
    item.data?.name ||
    item.data?.itemName ||
    item.data?.email ||
    item.moduleType;

  const itemDescription =
    item.data?.description ||
    item.data?.details ||
    item.reason ||
    "No description provided.";

  const formatDate = (dateValue?: string | Date) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[540px] rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#113e33] p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-[17px] font-bold tracking-tight">{itemTitle}</h3>
            <p className="text-xs text-emerald-200/80 mt-0.5 tracking-wide">
              {item.archiveId || item._id}
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 border border-white/10 uppercase tracking-wider">
            {item.moduleType}
          </span>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Description
            </label>
            <p className="text-sm text-[#334155] bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
              {itemDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Original Date
              </label>
              <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">
                {formatDate(item.createdAt)}
              </span>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Archived Date
              </label>
              <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">
                {formatDate(item.updatedAt)}
              </span>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Archived By
              </label>
              <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">
                {item.archivedBy || "System Admin"}
              </span>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Reason For Archiving
              </label>
              <span
                className="text-sm font-semibold text-[#1e293b] mt-0.5 block truncate"
                title={item.reason || "N/A"}
              >
                {item.reason || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#113e33] hover:bg-[#14493c] text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] shadow-sm shadow-slate-900/10 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveDetailsModal;