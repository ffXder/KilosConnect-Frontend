import { apiRequest } from "./authService";
import type { Task, NewTask, UpdateTask } from "../types/task";

//GET
export const getAllTasks = async (): Promise<Task[]> => {
    const res = await apiRequest('/tasks', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch tasks');
    }
    return res.json();
};

//POST
export const createTask = async (taskData: NewTask): Promise<Task> => {
    const res = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create task');
    }
    return res.json();
};


//PATCH
export const updateTask = async (taskId: string, taskData: UpdateTask): Promise<Task> => {
    const res = await apiRequest(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(taskData)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update task');
    }
    return res.json();
};

//PATCH
export const archiveTask = async (taskId: string): Promise<void> => {
    const res = await apiRequest(`/tasks/${taskId}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({ isArchived: true })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to archive task');
    }
};

export const unarchiveTask = async (taskId: string): Promise<void> => {
    const res = await apiRequest(`/tasks/${taskId}/unarchive`, {
        method: 'PATCH',
        body: JSON.stringify({ isArchived: false })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to unarchive task');
    }
};

export const getArchivedTasks = async (): Promise<Task[]> => {
    const res = await apiRequest('/tasks/archived', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch archived tasks');
    }
    return res.json();
}
