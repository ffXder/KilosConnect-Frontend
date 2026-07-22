import { useState, useEffect, useCallback } from 'react';
import type { Task, NewTask, UpdateTask } from '../types/task';
import * as TaskService from '../services/taskService';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await TaskService.getAllTasks();
            setTasks(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreate = async (data: NewTask) => {
        try {
            await TaskService.createTask(data);
            await fetchTasks(); // Refresh list
        } catch (err: any) {
            setError(err.message);
            throw err; 
        }
    };

    const handleUpdate = async (id: string, data: UpdateTask) => {
        try {
            await TaskService.updateTask(id, data);
            await fetchTasks();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const handleArchive = async (id: string) => {
        try {
            await TaskService.archiveTask(id);
            await fetchTasks();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { tasks, loading, error, refresh: fetchTasks, handleCreate, handleUpdate, handleArchive };
}