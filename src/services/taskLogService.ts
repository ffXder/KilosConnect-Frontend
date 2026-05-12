import { apiRequest } from "./authService";
import type { TaskLog } from "../types/task";

//GET
export const getTaskLogs = async (date?: string, status?: string): Promise<TaskLog[]> => {
    const query = new URLSearchParams();
    if (date) query.append('date', date);
    if (status) query.append('status', status);

    const res = await apiRequest(`/task-logs?${query.toString()}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch task logs');
    }
    return res.json();
};


//POST
export const generateDailyLogs = async (): Promise<{ message: string; skipped?: number }> => {
    const res = await apiRequest('/task-logs/generate', { method: 'POST' });
    const data = await res.json();

    if (res.status === 400 || res.status === 404) {
        return data;
    }

    if (!res.ok) {
        throw new Error(data.message || 'Failed to generate logs');
    }

    return data;
};

//PATCH
export const completeTaskLog = async (logId: string): Promise<TaskLog> => {
    const res = await apiRequest(`/task-logs/${logId}/complete`, {
        method: 'PATCH'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to complete task log');
    }
    return res.json();
};