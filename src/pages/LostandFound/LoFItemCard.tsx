import React from 'react';
import type { LostAndFound } from '../../types/lostAndFound';
import { MapPin, User, Calendar, Package, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../../utils/formatter';

interface LoFItemCardProps {
  item: LostAndFound;
  onClaim: (id: string) => void;
  onView: (item: LostAndFound) => void;
}

export const LoFItemCard: React.FC<LoFItemCardProps> = ({ item, onClaim, onView }) => (
  <div className="flex flex-col bg-white border border-[#e2e8f0] rounded-[16px] p-6 relative transition-all hover:shadow-sm h-full font-sans">
    {/* Clickable Area for Details */}
    <div className="cursor-pointer flex-1" onClick={() => onView(item)}>
      <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[11px] font-bold ${
        item.status === "Unclaimed" ? "bg-[#fef3c7] text-[#b45309]" : "bg-[#dcfce7] text-[#15803d]"
      }`}>
        {item.status}
      </span>

      <div className="w-10 h-10 bg-[#e6fffa] rounded-[8px] flex items-center justify-center mb-5">
        <Package size={18} className="text-[#1e4d46]" />
      </div>

      <h3 className="font-bold text-[#1a1a1a] text-[18px] mb-2">{item.item}</h3>
      <p className="text-[#64748b] text-[13px] leading-relaxed mb-5 line-clamp-2">{item.description}</p>

      <div className="space-y-3 mb-6 text-[13px] text-[#475569]">
        <div className="flex items-center gap-2.5">
          <MapPin size={14} className="text-[#94a3b8]" /> 
          <span className="text-gray-500">Found in:</span> <span className="font-semibold text-[#1a1a1a]">{item.areaFound}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <User size={14} className="text-[#94a3b8]" /> 
          <span className="text-gray-500">Found by:</span> <span className="font-semibold text-[#1a1a1a]">{item.reportedBy}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Calendar size={14} className="text-[#94a3b8]" /> 
          <span className="text-gray-500">Date:</span> <span className="font-semibold text-[#1a1a1a]">{formatDateTime(item.date)}</span>
        </div>
      </div>
    </div>

    {item.status === "Claimed" ? (
      <div className="mt-auto pt-4 border-t border-[#f1f5f9] text-[13px] space-y-2">
        <div className="flex items-center gap-2 text-[#15803d] font-semibold">
          <CheckCircle2 size={14}/> Claimed by: {item.claimedBy}
        </div>
        <div className="flex items-center gap-2 text-[#15803d] font-semibold">
          <Calendar size={14} /> On: {item.claimedAt ? formatDateTime(item.claimedAt) : '—'}
        </div>
      </div>
    ) : (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClaim(item.lostId); 
        }}
        className="mt-auto w-full py-3 bg-[#1e4d46] text-white text-[14px] font-bold rounded-[8px] transition-colors hover:bg-[#163a35]"
      >
        Mark as Claimed
      </button>
    )}
  </div>
);