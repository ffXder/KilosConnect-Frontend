import { useState, useEffect, useCallback } from 'react';
import type { TaskLog, ChecklistItem } from '../types/task';
import * as LogService from '../services/taskLogService';
import { socket } from '../config/socket';

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

    useEffect(() => {
        socket.connect();

        // handles real-time status changes
        const handleTaskUpdated = (payload: {
            taskLogId: string;
            status: TaskLog['status'];
            verificationStatus?: TaskLog['verificationStatus'];
            completedBy?: string;
            completedAt?: string;
            startedBy?: string;
            startedAt?: string;
        }) => {
            setLogs((prev) =>
                prev.map((log) => {
                    if (log._id === payload.taskLogId) {
                        return {
                            ...log,
                            status: payload.status,
                            ...(payload.verificationStatus && { verificationStatus: payload.verificationStatus }),
                            ...(payload.completedAt && { completedAt: payload.completedAt }),
                            ...(payload.startedAt && { startedAt: payload.startedAt })
                        };
                    }
                    return log;
                })
            );
        };

        // handles real-time checklist updates
        const handleChecklistUpdated = (payload: {
            taskLogId: string;
            checklist: ChecklistItem[];
        }) => {
            setLogs((prev) =>
                prev.map((log) =>
                    log._id === payload.taskLogId
                        ? { ...log, checklist: payload.checklist }
                        : log
                )
            );
        };

        // handle automatic re-fetch when new logs are generated
        const handleTasksGenerated = () => {
            fetchLogs();
        };

        socket.on('TASK_UPDATED', handleTaskUpdated);
        socket.on('CHECKLIST_UPDATED', handleChecklistUpdated);
        socket.on('TASKS_GENERATED', handleTasksGenerated);

        return () => {
            socket.off('TASK_UPDATED', handleTaskUpdated);
            socket.off('CHECKLIST_UPDATED', handleChecklistUpdated);
            socket.off('TASKS_GENERATED', handleTasksGenerated);
            socket.disconnect();
        };
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
            
            return updatedLog;
        } catch (err: any) {
            const msg = err.message || 'Failed to complete task log';
            setError(msg);
            throw new Error(msg); 
        }
    };

    return { logs, loading, error, refresh: fetchLogs, handleGenerate, handleComplete };
}