import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export interface ReviewItem {
  id: number;
  area: string;
  cust: string;
  time: string;
  progress: string;
  status: string;
}

interface ReviewListProps {
  reviews: ReviewItem[];
  onViewDetails: (review: ReviewItem) => void;
}

export default function ReviewList({ reviews, onViewDetails }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((item) => (
        <div 
          key={item.id}
          onClick={() => onViewDetails(item)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:border-gray-200 cursor-pointer select-none"
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-[#0a2e27]">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{item.area}</h4>
                <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">
                  {item.cust} · {item.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="bg-emerald-50 text-[#0a2e27] text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100">
                {item.progress}
              </span>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}