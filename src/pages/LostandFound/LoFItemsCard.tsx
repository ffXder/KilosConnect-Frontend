import React from 'react';
import type { LostAndFound } from '../../types/lostAndFound';
import { MapPin, User, Calendar, Package, CheckCircle2 } from 'lucide-react';

interface LoFItemCardProps {
  item: LostAndFound;
  onClaim: (id: string) => void;
}

export const LoFItemCard: React.FC<LoFItemCardProps> = ({ item, onClaim }) => (
  <div className="flex flex-col bg-white border border-[#e8e8e8] rounded-[12px] p-6 relative transition-all hover:shadow-md h-full font-sans">
    <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-[4px] text-[10px] font-semibold uppercase tracking-tight ${
      item.status === "Unclaimed" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
    }`}>
      {item.status}
    </span>

    <div className="w-10 h-10 bg-[#e6fffa] rounded-[8px] flex items-center justify-center mb-4">
      <Package size={20} className="text-[#1e4d46]" />
    </div>

    <h3 className="font-semibold text-[#1a1a1a] text-[17px] mb-1.5 tracking-tight">{item.item}</h3>
    <p className="text-[#64748b] text-[13px] leading-relaxed mb-4 line-clamp-2 font-normal">{item.description}</p>

    <div className="space-y-2.5 mb-6 text-[13px] text-[#475569]">
      <div className="flex items-center gap-2">
        <MapPin size={15} className="text-[#94a3b8]" /> 
        <span className="font-normal text-gray-500">Found in:</span> <span className="font-medium">{item.areaFound}</span>
      </div>
      <div className="flex items-center gap-2">
        <User size={15} className="text-[#94a3b8]" /> 
        <span className="font-normal text-gray-500">Found by:</span> <span className="font-medium">{item.reportedBy}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={15} className="text-[#94a3b8]" /> 
        <span className="font-normal text-gray-500">Date:</span> <span className="font-medium">{item.date}</span>
      </div>
    </div>

    {item.status === "Claimed" ? (
      <div className="mt-auto pt-4 border-t border-[#f1f5f9] text-[13px] font-medium text-green-600 space-y-1">
        <div className="flex items-center gap-1.5"><CheckCircle2 size={14}/> Claimed by: {item.claimedBy}</div>
        <div className="flex items-center gap-1.5"><Calendar size={14} className="opacity-0" /> On: {item.claimedAt}</div>
      </div>
    ) : (
      <button 
        onClick={() => onClaim(item._id)}
        className="mt-auto w-full py-2.5 bg-[#1e4d46] text-white text-sm font-semibold rounded-[8px] transition-colors hover:bg-[#163a35]"
      >
        Mark as Claimed
      </button>
    )}
  </div>
);