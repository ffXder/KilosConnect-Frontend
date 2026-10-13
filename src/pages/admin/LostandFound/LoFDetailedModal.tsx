import React from 'react';
import { X, MapPin, User, Calendar, Image as ImageIcon, Camera } from 'lucide-react';
import type { LostAndFound } from '../../../types/lostAndFound';
import { formatDate, formatDateTime } from '../../../utils/formatter';

interface DetailedModalProps {
  item: LostAndFound;
  onClose: () => void;
}

export const LoFDetailedModal: React.FC<DetailedModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Item Details</h2>
            <p className="text-white/70 text-sm opacity-90">Viewing information for {item.item}</p>
          </div>
          <button onClick={onClose} className="hover:text-white/70 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Images Section */}
            <div className="w-full space-y-6 lg:w-1/2">
              {/* Item Photo */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Item Photo (Found)</label>
                {item.itemImage?.url ? (
                  <div className="flex max-h-[60vh] w-full items-center justify-center overflow-hidden rounded-[16px] border border-[#e8e8e8] bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                    <img src={item.itemImage.url} alt={item.item} className="h-auto max-h-[55vh] w-auto max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="flex h-48 w-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] text-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    <ImageIcon size={32} strokeWidth={1} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium">No item image</span>
                  </div>
                )}
              </div>

              {/* Claimant Photo (Only shown if Claimed) */}
              {item.status === "Claimed" && (
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#15803d] dark:text-emerald-400">Claimant / Proof Photo</label>
                  {item.claimedImage ? (
                    <div className="flex max-h-[60vh] w-full items-center justify-center overflow-hidden rounded-[16px] border-2 border-[#dcfce7] bg-gray-50 p-2 dark:border-emerald-900 dark:bg-slate-800">
                      <img src={item.claimedImage.url} alt="Claimant proof" className="h-auto max-h-[55vh] w-auto max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex h-48 w-full flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#dcfce7] bg-[#f0fdf4] text-[#15803d]/50 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400/70">
                      <Camera size={32} strokeWidth={1} className="mb-2" />
                      <span className="text-xs font-medium">No claimant photo recorded</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3 ${
                  item.status === "Unclaimed"
                    ? "bg-[#fef3c7] text-[#b45309] dark:bg-amber-950/60 dark:text-amber-300"
                    : "bg-[#dcfce7] text-[#15803d] dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}>
                  {item.status}
                </span>
                <h3 className="text-2xl font-bold text-[#1a1a1a] dark:text-slate-100">{item.item}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-300">{item.description || "No description provided."}</p>
              </div>

              <div className="space-y-4 border-t border-[#f1f5f9] pt-4 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-3 text-[14px]">
                  <MapPin size={16} className="text-[#94a3b8] dark:text-slate-400" />
                  <span className="text-gray-500 dark:text-slate-400">Area Found:</span>
                  <span className="font-semibold text-[#1a1a1a] dark:text-slate-100">{item.areaFound}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[14px]">
                  <User size={16} className="text-[#94a3b8] dark:text-slate-400" />
                  <span className="text-gray-500 dark:text-slate-400">Found by:</span>
                  <span className="font-semibold text-[#1a1a1a] dark:text-slate-100">{item.reportedBy}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[14px]">
                  <Calendar size={16} className="text-[#94a3b8] dark:text-slate-400" />
                  <span className="text-gray-500 dark:text-slate-400">Date Found:</span>
                  <span className="font-semibold text-[#1a1a1a] dark:text-slate-100">{formatDate(item.date)}</span>
                </div>
              </div>

              {item.status === "Claimed" && (
                <div className="mt-4 space-y-2 rounded-[12px] border border-[#dcfce7] bg-[#f0fdf4] p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 text-sm text-[#15803d] dark:text-emerald-300">
                    <span className="font-bold">Claimed By:</span> {item.claimedBy}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#15803d] dark:text-emerald-300">
                    <span className="font-bold">Claim Date:</span> {item. claimedAt ? formatDateTime(item.claimedAt): '-'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-[#f4f5f6] pt-6 dark:border-slate-700">
            <button 
              onClick={onClose}
              className="w-full rounded-[12px] border border-[#e8e8e8] bg-[#f8fafc] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};