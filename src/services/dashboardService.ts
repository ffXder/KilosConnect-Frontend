import type { DashboardData } from '../types/dashboard';
import { apiRequest } from './authService';

// GET
export const getDashboard = async (): Promise<DashboardData> => {
    const res = await apiRequest('/dashboard/', { method: 'GET' });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Could not load dashboard stats');
    }
    return json.data;
}
