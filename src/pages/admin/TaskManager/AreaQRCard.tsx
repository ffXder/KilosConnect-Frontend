import React from 'react';
import { Download } from 'lucide-react';

interface AreaQrCardProps {
  area: string;
  qrImageUrl: string;
  onDownload: (areaName: string) => void;
}

export const AreaQrCard: React.FC<AreaQrCardProps> = ({ area, qrImageUrl, onDownload }) => {
  return (
    <div className="bg-white p-5 rounded-[20px] border border-gray-200/80 shadow-xs flex flex-col items-center hover:border-gray-300 transition-all group dark:bg-slate-950">
      <div className="bg-gray-50 p-3 rounded-[16px] border border-gray-100 mb-4 w-full flex items-center justify-center">
        <img
          src={qrImageUrl}
          alt={`QR Code for ${area}`}
          className="w-44 h-44 object-contain"
          loading="lazy"
        />
      </div>

      <span className="font-bold text-gray-800 text-center text-sm mb-4 line-clamp-1 dark:text-gray-50">
        {area}
      </span>

      <button
        onClick={() => onDownload(area)}
        className="w-full mt-auto py-2.5 px-4 bg-slate-100 hover:bg-[#113129] hover:text-white text-gray-700 text-xs font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer dark:bg-slate-800 dark:text-slate-50 "
      >
        <Download size={14} />
        <span>Download QR</span>
      </button>
    </div>
  );
};