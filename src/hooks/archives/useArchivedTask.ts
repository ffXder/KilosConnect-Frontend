import { useState, useEffect, useCallback } from 'react';
import { getArchivedTasks, unarchiveTask } from '../../services/taskService';
import type { Task } from '../../types/task';

export function useArchivedTasks() {
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArchivedTasks();
      setArchivedTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedTasks();
  }, [fetchArchivedTasks]);

  const handleUnarchive = async (taskId: string) => {
    try {
      await unarchiveTask(taskId);
      await fetchArchivedTasks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return { archivedTasks, loading, error, refresh: fetchArchivedTasks, handleUnarchive };
}