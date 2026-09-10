// components/AreaQrModal.tsx
import React, { useState } from 'react';
import { QrCode, Download, X } from 'lucide-react';
import { AreaQrCard } from './AreaQRCard';

interface AreaQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  areas: string[];
}

const getQrImageUrl = (areaName: string) => {
  const encodedData = encodeURIComponent(`AREA:${areaName}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&margin=10`;
};

export const AreaQrModal: React.FC<AreaQrModalProps> = ({ isOpen, onClose, areas }) => {
  const [downloadingAll, setDownloadingAll] = useState(false);

  if (!isOpen) return null;

  const downloadSingleQR = async (areaName: string) => {
    try {
      const url = getQrImageUrl(areaName);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QR_${areaName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download QR code:', err);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    for (const area of areas) {
      await downloadSingleQR(area);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    setDownloadingAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-[28px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 dark:border border-slate-600">
        
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950 dark:border-b border-slate-600">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5 dark:text-slate-50">
              <QrCode className="text-[#113129] dark:text-[#207D55]" size={26} />
              Facility Area QR Codes
            </h2>
            <p className="text-sm text-gray-500 mt-1 dark:text-slate-300">
              Print and post these QR codes in their respective facility zones for quick custodian scanning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="bg-[#113129] text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold flex items-center gap-2 hover:bg-[#0a211b] transition-all disabled:opacity-50 cursor-pointer dark:bg-[#207D55] dark:hover:bg-[#07201b]"
            >
              <Download size={16} />
              <span>{downloadingAll ? 'Downloading...' : 'Download All'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* QR Grid */}
        <div className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-[#f8fafc]  dark:bg-slate-950 transition-colors duration-300">
          {areas.map((area) => (
            <AreaQrCard
              key={area}
              area={area}
              qrImageUrl={getQrImageUrl(area)}
              onDownload={downloadSingleQR}
            />
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end dark:bg-slate-950 dark:border border-slate-600">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-[12px] hover:bg-gray-50 text-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};