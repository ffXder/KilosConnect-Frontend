import { apiRequest } from './authService';
import type { AreaQRCode } from '../types/task';

// GET
export const generateAreaQRCodes = async (): Promise<AreaQRCode[]> => {
    const res = await apiRequest('/areas/qr-codes', { method: 'GET'});
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to generate area QR  codes');
    }
    return res.json();
}