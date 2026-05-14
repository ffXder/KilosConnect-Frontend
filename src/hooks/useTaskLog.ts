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

    const handleComplete = async (id: string) => {
        try {
            await LogService.completeTaskLog(id);
            await fetchLogs();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { logs, loading, error, refresh: fetchLogs, handleGenerate, handleComplete };
}