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

// GET by scanned area
export const getTasksByArea = async (area:string): Promise<{ message: string, taskLogs: TaskLog[]}> => {
    const res = await apiRequest(`/task-logs/scan-zone/${encodeURIComponent(area)}`);
    if (res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch task for this area');
    }
    return res.json();
}

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
export const completeTaskLog = async (logId: string, photoFile?: File, isLiveCamera?: boolean): Promise<TaskLog> => {
    const headers: Record<string, string> = {};
    let body: FormData | undefined;

    if (photoFile) {
        body = new FormData();
        body.append('file', photoFile);
    }

    if (isLiveCamera) {
        headers['x-source-camera'] = 'live-camera' // allows headers to capture live camera
    }

    const res = await apiRequest(`/task-logs/${logId}/complete`, {
        method: 'PATCH',
        headers,
        body
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to complete task log');
    }
    return res.json();
};