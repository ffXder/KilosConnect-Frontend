import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QRScanner: React.FC = () => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;
        let isScanning = false;

        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                isScanning = false;
                const goToScannedUrl = () => {
                    try {
                        const url = new URL(decodedText);
                        navigate(url.pathname);
                        console.log('Decoded text:', decodedText);
                        console.log('Navigating to:', url.pathname);
                    } catch {
                        console.error('Scanned text is not a valid URL:', decodedText);
                    }
                };
                scanner.stop().then(goToScannedUrl).catch(goToScannedUrl);
            },
            (errorMessage) => {
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
    }, [navigate]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div id="qr-reader" className="w-full max-w-sm rounded-2xl overflow-hidden" />
            <p className="[font-family:'Poppins',Helvetica] text-gray-400 text-sm">Point your camera at a QR code</p>
        </div>
    );
};

export default QRScanner;