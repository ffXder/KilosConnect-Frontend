import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, X, Loader2, FileImage, AlertTriangle } from 'lucide-react';
import { preprocessImage, cropCenterImage } from '../../../utils/imageUtils';

interface ImageUploadViewProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function ImageUploadView({ onScanSuccess }: ImageUploadViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    const scanner = new Html5Qrcode('qr-file-reader');
    let decodedText: string | null = null;

    try {
      // image filtering passes 
      const passes = [
        { name: "Pass 1: Raw Original", getFile: async() => selectedFile},
        {
          name: "Pass 2: Contrast & Grayscale filter",
          getFile: async() => {
            const blob = await preprocessImage(selectedFile);
            return new File([blob], "processed.png", { type: "image/png" });
          }
        },
        {
          name: "Pass 3: Auto crop image",
          getFile: async() => {
            const blob = await cropCenterImage(selectedFile);
            return new File([blob], "cropped.png", { type: "image/png" });
          }
        }
      ];

      // loops until one succeeds in scanning QR code
      for (const pass of passes) {
        try {
          console.log(`[QR Scanner] Attemting ${pass.name}...`);
          const fileToScan = await pass.getFile();

          decodedText = await scanner.scanFile(fileToScan, false);

          if (decodedText) {
            console.log(`[QR Scanner] Success on ${pass.name}! Decoded:`, decodedText) //test only
            break;
          }
        } catch (passError) {
          console.warn(`[QR Scanner] ${pass.name} failed to find a QR code.`)
        }
      }

      if (decodedText) {
        onScanSuccess(decodedText);
      } else {
        setError('No QR code found in that image. Try reuploading QR code or taking a clearer photo');
      }
    } catch (err) {
      console.error('Failed to analyze image:', err);
      setError('Error reading file. Please try another image.');
    } finally {
      setIsProcessing(false);
      try {
        await scanner.clear();
      } catch {
        // ignore render
      }
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center font-['Poppins']">

      {/* Hidden mount point required by Html5Qrcode's scanFile */}
      <div id="qr-file-reader" className="hidden" />

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
              onClick={handleRemove}
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

      {/* Decode error */}
      {error && (
        <div className="w-full flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-medium px-3.5 py-2.5 rounded-xl mb-4">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Process Button */}
      <button
        onClick={handleVerify}
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