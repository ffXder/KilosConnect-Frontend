import { useState, useEffect, useCallback } from 'react';
import type { TaskLog } from '../types/task';
import * as LogService from '../services/taskLogService';

export function useTaskLogs(date?: string, status?: string) {
    const [logs, setLogs] = useState<TaskLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await LogService.getTaskLogs(date, status);
            setLogs(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [date, status]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleGenerate = async (): Promise<{ message: string; skipped?: number} | undefined> => {
        try {
            const result = await LogService.generateDailyLogs();
            await fetchLogs();
            return result
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const handleComplete = async (
        id: string,
        photoFile?: File,
        isLiveCamera: boolean = false
    ): Promise<TaskLog> => {
        try {
            setError(null);
            const updatedLog = await LogService.completeTaskLog(id, photoFile, isLiveCamera);
            
            
            setLogs((prev) => prev.map((log) => (log._id === id ? updatedLog : log)));
            await fetchLogs();
            
            return updatedLog;
        } catch (err: any) {
            const msg = err.message || 'Failed to complete task log';
            setError(msg);
            throw new Error(msg); 
        }
    };

    return { logs, loading, error, refresh: fetchLogs, handleGenerate, handleComplete };
}