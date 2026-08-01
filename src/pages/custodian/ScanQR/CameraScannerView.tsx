import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

interface CameraScannerViewProps {
  isScanning: boolean;
  onTriggerScan: () => void;
}

export default function CameraScannerView({ isScanning, onTriggerScan }: CameraScannerViewProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please check your browser permissions.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  return (
    <div className="w-full max-w-sm flex flex-col items-center font-['Poppins']">

      {/* Viewfinder / Video Container */}
      <div className="w-full aspect-square bg-[#0F172A] rounded-2xl flex flex-col items-center justify-center text-gray-400 mb-6 relative overflow-hidden shadow-sm border-2 border-gray-800">

        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
            <Loader2 size={48} className="animate-spin text-emerald-500" />
            <p className="text-sm font-bold text-gray-200">Reading QR Code...</p>
          </div>
        )}

        {/* Live Framing Overlay */}
        {cameraActive && !isScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="w-4/5 h-0.5 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-bounce"></div>
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br"></div>
            <span className="absolute bottom-3 font-mono text-[10px] text-emerald-400 bg-black/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Live Feed Connected
            </span>
          </div>
        )}

        {/* Idle / Error State */}
        {!cameraActive && (
          <div className="p-6 text-center flex flex-col items-center">
            {cameraError ? (
              <>
                <AlertTriangle size={48} className="text-rose-500 mb-3" />
                <p className="text-xs font-medium text-rose-400">{cameraError}</p>
              </>
            ) : (
              <>
                <QrCode size={80} className="opacity-25 mb-3" />
                <p className="text-xs font-medium text-gray-400 max-w-[200px]">
                  Allow camera access to scan physical QR codes
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      {!cameraActive ? (
        <button
          onClick={startCamera}
          className="w-full bg-[#0a2e27] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#08241f] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Camera size={18} />
          Turn On Device Camera
        </button>
      ) : (
        <div className="w-full flex gap-3">
          <button
            onClick={stopCamera}
            className="p-3.5 border border-[#e2e8f0] rounded-xl text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            title="Stop Camera"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="flex-1 bg-[#0a2e27] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#08241f] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera size={18} />
            {isScanning ? "Processing..." : "Capture & Verify QR"}
          </button>
        </div>
      )}
    </div>
  );
}