import { apiRequest } from "./authService";
import type { Task, NewTask, UpdateTask } from "../types/task";

//GET
export const getAllTasks = async (frequency?: string, dayType?: string): Promise<Task[]> => {
    const query = new URLSearchParams();
    if (frequency) query.append('frequency', frequency);
    if (dayType) query.append('dayType', dayType);

    const endpoint = query.toString() ? `/tasks?${query.toString()}` : '/tasks';
    const res = await apiRequest(endpoint, { method: 'GET' });
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

//POST
export const archiveTask = async (taskId: string): Promise<void> => {
    const res = await apiRequest(`/tasks/${taskId}/archive`, { method: 'POST' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to archive task');
    }
};

