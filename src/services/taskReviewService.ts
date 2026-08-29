import { apiRequest } from './authService';
import type { TaskLog } from '../types/task'

// CUSTODIAN TASK REVIEW

// GET 
export const getPendingReviewQueue = async (): Promise<TaskLog[]> => {
    const res = await apiRequest('/task-reviews/pending', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch pending reviews');
    }
    return res.json();
};

// PATCH custodian approves peer task submission
export const approvePeerTask = async (logId: string, note?: string): Promise<{ message: string; taskLog: TaskLog }> => {
    const res = await apiRequest(`/task-reviews/${logId}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ note })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to approve peer task');
    }
    return res.json();
};

// PATCH custodian disputes peer task submission
export const disputePeerTask = async (logId: string, reason: string): Promise<{ message: string; taskLog: TaskLog }> => {
    const res = await apiRequest(`/task-reviews/${logId}/dispute`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to dispute peer task');
    }
    return res.json();
};

// GET
export const getDisputedQueue = async (): Promise<TaskLog[]> => {
    const res = await apiRequest('/task-moderations/disputed', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch disputed tasks');
    }
    return res.json();
};

// ADMIN MODERATION

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