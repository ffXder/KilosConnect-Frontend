import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { Camera, Image, CheckCircle2 } from 'lucide-react';
import CameraScannerView from "./CameraScannerView";
import ImageUploadView from "./ImageUploadView";

export default function ScanQRPage() {
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [verifiedTarget, setVerifiedTarget] = useState<string | null>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(
    JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
  );

  useEffect(() => {
    const syncSidebar = () => {
      setSidebarExpanded(
        JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
      );
    };
    const interval = setInterval(syncSidebar, 100);
    return () => clearInterval(interval);
  }, []);

  const { role } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  const handleStartScan = () => {
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('success');
      setVerifiedTarget("Detected Zone Area");
    }, 2000);
  };

  const handleReset = () => {
    setScanStatus('idle');
    setVerifiedTarget(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] flex-col md:flex-row font-['Poppins']">
      <SidebarNavigationSection userRole={userRole} />

      <div
        className={`transition-all duration-300 p-4 pt-20 sm:p-6 sm:pt-24 md:p-8 flex-1 min-w-0 ${
          sidebarExpanded ? "md:ml-[15px]" : "md:ml-[15px]"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Scan QR Code</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Capture a live photo or upload a saved QR image to access and verify zone maintenance
            </p>
          </div>

          {/* Scanner Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center">

            {/* Mode Switcher Tabs */}
            {scanStatus !== 'success' && (
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-1.5 rounded-xl flex gap-1 mb-8 w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setScanMode('camera')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                    scanMode === 'camera'
                      ? 'bg-white text-gray-900 shadow-sm border border-[#e2e8f0]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Camera size={15} />
                  Live Camera
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode('upload')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                    scanMode === 'upload'
                      ? 'bg-white text-gray-900 shadow-sm border border-[#e2e8f0]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Image size={15} />
                  Saved Photo
                </button>
              </div>
            )}

            {/* Main Interactive View */}
            {scanStatus === 'success' ? (
              <div className="w-full max-w-sm aspect-square bg-[#0a2e27] rounded-2xl flex flex-col items-center justify-center text-white mb-6 p-6 shadow-md">
                <CheckCircle2 size={64} className="text-emerald-400 mb-3 animate-bounce" />
                <h3 className="text-xl font-bold">Zone Verified!</h3>
                <p className="text-xs text-emerald-100/80 mt-1">{verifiedTarget} logged successfully</p>
                <p className="text-xs text-emerald-200/60 mt-4">Redirecting to task checklist...</p>
              </div>
            ) : scanMode === 'camera' ? (
              <CameraScannerView
                isScanning={scanStatus === 'scanning'}
                onTriggerScan={handleStartScan}
              />
            ) : (
              <ImageUploadView
                isProcessing={scanStatus === 'scanning'}
                onProcessImage={handleStartScan}
              />
            )}

            {/* Reset / Rescan Action */}
            {scanStatus === 'success' && (
              <button
                onClick={handleReset}
                className="w-full max-w-sm bg-[#f8fafc] border border-[#e2e8f0] text-gray-700 font-bold text-sm py-3.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Scan Another QR Code
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}