import type { ArchiveRecord, ArchiveStats } from "../types/archive";
import { apiRequest } from "./authService";

export interface ArchivePagination {
    totalArchives: number;
    totalPages: number;
    currentPage: number;
}

export interface ArchiveApiResponse {
    archives: ArchiveRecord[];
    pagination: ArchivePagination;
}

// GET ALL
export const getAllArchives = async (params?: {
    moduleType?: string;
    search?: string;
    page?: number;
    date?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
}): Promise<ArchiveApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.moduleType) queryParams.set("moduleType", params.moduleType);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.date && params.date !== "All Dates") queryParams.set("date", params.date);
    if (params?.startDate) queryParams.set("startDate", params.startDate);
    if (params?.endDate) queryParams.set("endDate", params.endDate);
    if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);
    const query = queryParams.toString();
    const res = await apiRequest(`/archives${query ? `?${query}` : ""}`, { method: 'GET' });
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