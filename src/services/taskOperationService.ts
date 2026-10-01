import { apiRequest } from "./authService";
import type { TaskLog, ChecklistItem, TaskSummary } from "../types/task";

// GET all task logs for today (custodians)
export const getTodayTasks = async (): Promise<{ summary: TaskSummary; taskLogs: TaskLog[] }> => {
    const res = await apiRequest('/task-operations/today', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch today\'s tasks');
    }
    return res.json();
};

// GET task logs by scanned zone QR code
export const getTasksByArea = async (area: string): Promise<{ message: string; summary: any; taskLogs: TaskLog[] }> => {
    const res = await apiRequest(`/task-operations/scan-zone/${encodeURIComponent(area)}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch tasks for this area');
    }
    return res.json();
};

// PATCH start a task log (Pending -> In Progress)
export const startTaskLog = async (logId: string): Promise<TaskLog> => {
    const res = await apiRequest(`/task-operations/${logId}/start`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to start task log');
    }
    const data = await res.json();
    return data.taskLog; // backend returns { message, taskLog }
};

// PATCH toggle one checklist item (must be In Progress)
export const toggleChecklistItem = async (logId: string, itemId: string): Promise<ChecklistItem[]> => {
    const res = await apiRequest(`/task-operations/${logId}/checklist/${itemId}`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update checklist');
    }
    const data = await res.json();
    return data.checklist; 
};

// PATCH complete a task log (live photo required if task.requiresVerification)
export const completeTaskLog = async (logId: string, photo?: Blob): Promise<TaskLog> => {
    let body: FormData | undefined;

    if (photo) {
        body = new FormData();
        body.append('photo', photo, 'capture.jpg'); // must match multer's field name
    }

    const res = await apiRequest(`/task-operations/${logId}/complete`, {
        method: 'PATCH',
        headers: { 'x-source-capture': 'live-camera' }, // must match the controller's header name
        body
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to complete task log');
    }
    return res.json();
};