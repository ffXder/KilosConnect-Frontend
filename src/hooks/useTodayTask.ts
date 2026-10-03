import { useState, useEffect, useCallback } from "react";
import {
    getTodayTasks,
    startTaskLog,
    toggleChecklistItem,
    completeTaskLog
} from "../services/taskOperationService";
import type { TaskLog, TaskSummary, UserSummary } from "../types/task";
import type { TaskItem } from "../pages/custodian/TaskOperation/TaskDetailsModal";

const fullName = (u?: UserSummary | null) =>
  u ? `${u.firstName} ${u.lastName ?? ''}`.trim() : null;

const toTaskItem = (log: TaskLog): TaskItem => ({
    id: log._id,
    title: log.task.title,
    zone: log.task.area,
    startTime: log.task.startTime,
    startedBy: fullName(log.startedBy),
    completedBy: fullName(log.completedBy),
    priority: log.task.priority,
    status: log.status,
    dueDate: log.task.endTime,
    requiresVerification: log.task.requiresVerification,
    checklist: (log.checklist ?? []).map((c, i) => ({
        id: c._id ?? String(i),
        text: c.label,
        completed: c.isDone
    }))
});

export function useTodayTasks() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [summary, setSummary] = useState<TaskSummary>({ activePending: 0, flagged: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const data = await getTodayTasks();
            setTasks(data.taskLogs.map(toTaskItem));
            setSummary(data.summary);
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const start = async (id: string) => {
        await startTaskLog(id);
        await load();
    };

    const toggle = async (id: string, itemId: string) => {
        await toggleChecklistItem(id, itemId);
        await load();
    };

    const complete = async (id: string, photo?: Blob) => {
        try {
        await completeTaskLog(id, photo);
    } finally {
        await load();   // always refresh
    }
    };

    return { tasks, summary, loading, error, reload: load, start, toggle, complete };
}