import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { Camera, Image, CheckCircle2, Wrench, MapPin, AlertTriangle } from 'lucide-react';
import QRScanner from "../../../components/QRScanner";
import ImageUploadView from "../../../components/QRImageUpload";

// maps how qr should behave
const SCAN_TYPES = [
  {
    type: 'equipment' as const,
    pattern: /^\/asset\/scan\/([^/]+)$/,
    icon: Wrench,
    title: 'Equipment Recognized',
    getLabel: (id: string) => decodeURIComponent(id),
    getMessage: (label: string) => `Opening issue report for ${label}...`,
  },
  {
    type: 'zone' as const,
    pattern: /^\/task\/scan-zone\/([^/]+)$/,
    icon: MapPin,
    title: 'Zone Recognized',
    getLabel: (area: string) => decodeURIComponent(area),
    getMessage: (label: string) => `Loading available tasks for ${label}...`,
  },
];

interface ScanResult {
  icon: typeof CheckCircle2;
  title: string;
  message: string;
  pathname: string;
  search: string;
  hash: string;
}

export default function ScanQRPage() {
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanResetKey, setScanResetKey] = useState(0);
  const navigate = useNavigate();

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
  const userRole = (role ?? "admin") as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  // Called by QRScanner once a real code is decoded — figures out what kind
  // of QR it is (equipment, zone, etc.) and shows the matching success state.
  const handleQRDetected = (decodedText: string) => {
    let url: URL;
    try {
      url = new URL(decodedText);
    } catch {
      console.error('Scanned text is not a valid URL:', decodedText);
      setScanResult({
        icon: AlertTriangle,
        title: 'Unrecognized QR Code',
        message: 'This QR code isn\'t a valid KilosConnect code.',
        pathname: '', search: '', hash: '',
      });
      setScanStatus('success');
      return;
    }

    // reject invalid qr that isn't from the kilos
    // if (url.origin !== window.location.origin) {
    //   console.warn('Blocked cross-origin QR scan:', url.origin);
    //   setScanResult({
    //     icon: AlertTriangle,
    //     title: 'Unrecognized QR Code',
    //     message: 'This QR code doesn\'t belong to KilosConnect.',
    //     pathname: '', search: '', hash: '',
    //   });
    //   setScanStatus('success');
    //   return;
    // }

    const matched = SCAN_TYPES.find((t) => t.pattern.test(url.pathname));

    // No match = don't navigate anywhere. Only known, whitelisted
    // route shapes (equipment / zone) are allowed to route the user.
    if (!matched) {
      console.warn('QR path did not match any known scan type:', url.pathname);
      setScanResult({
        icon: AlertTriangle,
        title: 'Unrecognized QR Code',
        message: 'This QR code isn\'t linked to any equipment or zone.',
        pathname: '', search: '', hash: '',
      });
      setScanStatus('success');
      return;
    }

    const match = matched.pattern.exec(url.pathname)!;
    const label = matched.getLabel(match[1]);

    setScanResult({
      icon: matched.icon,
      title: matched.title,
      message: matched.getMessage(label),
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    });
    setScanStatus('success');

    setTimeout(() => {
      navigate(url.pathname + url.search + url.hash);
    }, 1800); //
  };

  const handleReset = () => {
    setScanStatus('idle');
    setScanResult(null);
    setScanResetKey((k) => k + 1); // forces QRScanner to fully remount, clearing its `detected` state
  };

  const ResultIcon = scanResult?.icon ?? CheckCircle2;

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
              Capture a live photo or upload a saved QR image to access equipment, zones, or tasks
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
            {scanStatus === 'success' && scanResult ? (
              <div className="w-full max-w-sm aspect-square bg-[#0a2e27] rounded-2xl flex flex-col items-center justify-center text-white mb-6 p-6 shadow-md">
                <ResultIcon size={64} className="text-emerald-400 mb-3 animate-bounce" />
                <h3 className="text-xl font-bold">{scanResult.title}</h3>
                <p className="text-xs text-emerald-100/80 mt-1">{scanResult.message}</p>
                <p className="text-xs text-emerald-200/60 mt-4">Redirecting...</p>
              </div>
            ) : scanMode === 'camera' ? (
              <QRScanner key={scanResetKey} onScanSuccess={handleQRDetected} />
            ) : (
              <ImageUploadView onScanSuccess={handleQRDetected} />
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