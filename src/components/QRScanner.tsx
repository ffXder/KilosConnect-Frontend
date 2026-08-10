import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [detected, setDetected] = useState(false);

    useEffect(() => {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;
        let isScanning = false;

        scanner.start(
            { facingMode: 'environment' },
            { 
                fps: 15,
                qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
                isScanning = false;
                setDetected(true);

                scanner.stop()
                    .then(() => setTimeout(() => onScanSuccess(decodedText), 350))
                    .catch(() => setTimeout(() => onScanSuccess(decodedText), 350));
            },
            (errorMessage) => {
                if (errorMessage.includes('NotFoundException')) return;
                console.warn('QR Code scan error:', errorMessage);
            }
        ).then(() => {
            isScanning = true;
        }).catch((err) => {
            console.error('Failed to start scanner:', err);
        });

        return () => {
            if (isScanning) {
                scannerRef.current?.stop().catch(() => {});
            }
        };
    });

    return (
        <div className="w-full max-w-sm flex flex-col items-center font-['Poppins']">
            <div className="w-full aspect-square bg-[#0F172A] rounded-2xl overflow-hidden shadow-sm border-2 border-gray-800 mb-6 relative">
                <div
                    id="qr-reader"
                    className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>video]:block"
                />

                {/* Framing Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    {/* Sweeping scan line */}
                    {!detected && (
                        <div
                            className="absolute left-[10%] w-4/5 h-0.5 bg-white shadow-[0_0_15px_#10b981]"
                            style={{ animation: 'scan-sweep 2s ease-in-out infinite' }}
                        />
                    )}
 
                    {/* Corner brackets */}
                    <div
                        className={`absolute w-8 h-8 border-t-4 border-l-4 rounded-tl transition-all duration-300 ${
                            detected
                                ? 'top-1/2 left-1/2 -translate-x-10 -translate-y-10 border-emerald-500 scale-75'
                                : 'top-6 left-6 border-white'
                        }`}
                    />
                    <div
                        className={`absolute w-8 h-8 border-t-4 border-r-4 rounded-tr transition-all duration-300 ${
                            detected
                                ? 'top-1/2 right-1/2 translate-x-10 -translate-y-10 border-emerald-500 scale-75'
                                : 'top-6 right-6 border-white'
                        }`}
                    />
                    <div
                        className={`absolute w-8 h-8 border-b-4 border-l-4 rounded-bl transition-all duration-300 ${
                            detected
                                ? 'bottom-1/2 left-1/2 -translate-x-10 translate-y-10 border-emerald-500 scale-75'
                                : 'bottom-6 left-6 border-white'
                        }`}
                    />
                    <div
                        className={`absolute w-8 h-8 border-b-4 border-r-4 rounded-br transition-all duration-300 ${
                            detected
                                ? 'bottom-1/2 right-1/2 translate-x-10 translate-y-10 border-emerald-500 scale-75'
                                : 'bottom-6 right-6 border-white'
                        }`}
                    />

                    <span
                        className={`absolute bottom-3 font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-colors duration-300 ${
                            detected ? 'bg-emerald-500/80 text-white' : 'bg-black/60 text-white'
                        }`}
                    >
                        {detected ? 'QR Code Found' : 'Align QR Code within frame'}
                    </span>
                </div>
            </div>
            <p className="text-gray-400 text-sm">Point your camera at a QR code</p>
        </div>
    );
};

export default QRScanner;