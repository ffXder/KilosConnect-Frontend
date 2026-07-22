import { apiRequest } from "./authService";
import type { TaskLog } from "../types/task";

// GET
export const getDisputedQueue = async (): Promise<TaskLog[]> => {
    const res = await apiRequest('/task-moderations/disputed', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch disputed tasks');
    }
    return res.json();
};

// PATCH admin resolves a disputed task
export const resolveDispute = async (
    logId: string,
    resolution: 'APPROVE' | 'REJECT',
    adminNote?: string
): Promise<{ message: string; taskLog: TaskLog }> => {
    const res = await apiRequest(`/task-moderations/${logId}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ resolution, adminNote })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to resolve dispute');
    }
    return res.json();
};