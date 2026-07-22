import { useState, useCallback } from 'react';
import type { AreaQRCode } from '../types/task';
import { generateAreaQRCodes } from '../services/areaService';

export const useAreaQR = () => {
  const [qrCodes, setQrCodes] = useState<AreaQRCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateAreaQRCodes();
      setQrCodes(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR codes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    qrCodes,
    loading,
    error,
    generateCodes,
  };
};