import type { ArchiveRecord, ArchiveStats } from "../types/archive";
import { apiRequest } from "./authService";

// GET ALL
export const getAllArchives = async (params?: { moduleType?: string; search?: string }): Promise<ArchiveRecord[]> => {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const res = await apiRequest(`/archives`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch archives');
    }
    return res.json();
};

// GET STATS
export const getArchiveStats = async (): Promise<ArchiveStats> => {
    const res = await apiRequest('/archives/stats', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch archive stats');
    }
    return res.json();
};

// POST UNARCHIVE (RESTORE)
export const unarchiveRecord = async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await apiRequest(`/archives/restore/${id}`, { method: 'POST' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to restore record');
    }
    return res.json();
};