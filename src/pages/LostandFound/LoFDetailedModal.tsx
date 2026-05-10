import React from 'react';
import { X, MapPin, User, Calendar, Image as ImageIcon, Camera } from 'lucide-react';
import type { LostAndFound } from '../../types/lostAndFound';
import { formatDate, formatDateTime } from '../../utils/formatter';

interface DetailedModalProps {
  item: LostAndFound;
  onClose: () => void;
}

export const LoFDetailedModal: React.FC<DetailedModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[800px] overflow-hidden">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Item Details</h2>
            <p className="text-white/70 text-sm opacity-90">Viewing information for {item.item}</p>
          </div>
          <button onClick={onClose} className="hover:text-white/70 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Images Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Item Photo */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Item Photo (Found)</label>
                {item.itemImage?.url ? (
                  <div className="w-full h-64 rounded-[16px] overflow-hidden border border-[#e8e8e8]">
                    <img src={item.itemImage?.url} alt={item.item} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-[16px] bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} strokeWidth={1} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium">No item image</span>
                  </div>
                )}
              </div>

              {/* Claimant Photo (Only shown if Claimed) */}
              {item.status === "Claimed" && (
                <div>
                  <label className="block text-xs font-bold text-[#15803d] mb-3 uppercase tracking-widest">Claimant / Proof Photo</label>
                  {item.claimedImage ? (
                    <div className="w-full h-64 rounded-[16px] overflow-hidden border-2 border-[#dcfce7]">
                      <img src={item.claimedImage?.url} alt="Claimant proof" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-[16px] bg-[#f0fdf4] border-2 border-dashed border-[#dcfce7] flex flex-col items-center justify-center text-[#15803d]/50">
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
                  item.status === "Unclaimed" ? "bg-[#fef3c7] text-[#b45309]" : "bg-[#dcfce7] text-[#15803d]"
                }`}>
                  {item.status}
                </span>
                <h3 className="text-2xl font-bold text-[#1a1a1a]">{item.item}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.description || "No description provided."}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f1f5f9]">
                <div className="flex items-center gap-3 text-[14px]">
                  <MapPin size={16} className="text-[#94a3b8]" />
                  <span className="text-gray-500">Area Found:</span>
                  <span className="font-semibold text-[#1a1a1a]">{item.areaFound}</span>
                </div>
                <div className="flex items-center gap-3 text-[14px]">
                  <User size={16} className="text-[#94a3b8]" />
                  <span className="text-gray-500">Found by:</span>
                  <span className="font-semibold text-[#1a1a1a]">{item.reportedBy}</span>
                </div>
                <div className="flex items-center gap-3 text-[14px]">
                  <Calendar size={16} className="text-[#94a3b8]" />
                  <span className="text-gray-500">Date Found:</span>
                  <span className="font-semibold text-[#1a1a1a]">{formatDate(item.date)}</span>
                </div>
              </div>

              {item.status === "Claimed" && (
                <div className="mt-4 p-4 bg-[#f0fdf4] rounded-[12px] border border-[#dcfce7] space-y-2">
                  <div className="flex items-center gap-2 text-[#15803d] text-sm">
                    <span className="font-bold">Claimed By:</span> {item.claimedBy}
                  </div>
                  <div className="flex items-center gap-2 text-[#15803d] text-sm">
                    <span className="font-bold">Claim Date:</span> {item. claimedAt ? formatDateTime(item.claimedAt): '-'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#f4f5f6]">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-[#f8fafc] border border-[#e8e8e8] rounded-[12px] text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};