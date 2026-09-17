import { apiRequest } from "./authService";
import type { TaskLog, ChecklistItem, VerificationStatus, TaskLogStatus } from "../types/task";

// GET task logs filtered by date and/or status
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

// GET task logs by scanned area (Fixed logic error in !res.ok check)
export const getTasksByArea = async (area: string): Promise<{ message: string; taskLogs: TaskLog[] }> => {
    const res = await apiRequest(`/task-logs/scan-zone/${encodeURIComponent(area)}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch tasks for this area');
    }
    return res.json();
};

// POST generate daily logs
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

// PATCH start a task log (Pending -> In Progress)
export const startTaskLog = async (logId: string): Promise<TaskLog> => {
    const res = await apiRequest(`/task-logs/${logId}/start`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to start task log');
    }
    return res.json();
};

// PATCH update checklist items
export const updateChecklist = async (logId: string, checklist: ChecklistItem[]): Promise<TaskLog> => {
    const res = await apiRequest(`/task-logs/${logId}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update checklist');
    }
    return res.json();
};

// PATCH complete a task log
export const completeTaskLog = async (logId: string, photoFile?: File, isLiveCamera?: boolean): Promise<TaskLog> => {
    const headers: Record<string, string> = {};
    let body: FormData | undefined;

    if (photoFile) {
        body = new FormData();
        body.append('file', photoFile);
    }

    if (isLiveCamera) {
        headers['x-source-camera'] = 'live-camera';
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

// PATCH  verify task log submission
export const verifyTaskLog = async (
    logId: string, 
    verificationStatus: VerificationStatus, 
    verificationNote?: string
): Promise<TaskLog> => {
    const res = await apiRequest(`/task-logs/${logId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus, verificationNote })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update verification status');
    }
    return res.json();
};