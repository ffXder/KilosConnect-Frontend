import React, { useState } from 'react';
import { Upload, X, Loader2, FileImage } from 'lucide-react';

interface ImageUploadViewProps {
  isProcessing: boolean;
  onProcessImage: () => void;
}

export default function ImageUploadView({ isProcessing, onProcessImage }: ImageUploadViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center font-['Poppins']">

      {/* Upload Zone / Image Preview */}
      <div className="w-full aspect-square rounded-2xl mb-6 overflow-hidden relative border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] flex flex-col items-center justify-center transition-colors hover:border-[#0a2e27]">
        {selectedImage ? (
          <div className="relative w-full h-full bg-black">
            <img
              src={selectedImage}
              alt="Saved QR code preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6 text-center">
            <div className="bg-emerald-50 text-[#0a2e27] p-4 rounded-xl mb-3">
              <Upload size={26} />
            </div>
            <span className="text-sm font-bold text-gray-800">Upload saved QR photo</span>
            <span className="text-xs font-medium text-gray-400 mt-1">PNG, JPG, or WEBP from gallery</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Process Button */}
      <button
        onClick={onProcessImage}
        disabled={!selectedImage || isProcessing}
        className="w-full bg-[#0a2e27] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#08241f] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing Image QR...
          </>
        ) : (
          <>
            <FileImage size={18} />
            Verify Saved QR Image
          </>
        )}
      </button>
    </div>
  );
}