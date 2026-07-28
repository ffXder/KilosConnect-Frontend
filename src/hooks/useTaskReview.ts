// buddy system
import { useState, useEffect, useCallback } from 'react';
import type { TaskLog } from '../types/task';
import { 
  getPendingReviewQueue, 
  approvePeerTask, 
  disputePeerTask 
} from '../services/taskReviewService';

export const useTaskReviews = () => {
  const [pendingQueue, setPendingQueue] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingReviewQueue();
      setPendingQueue(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load peer review queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingQueue();
  }, [fetchPendingQueue]);

  const approve = async (logId: string, note?: string) => {
    try {
      await approvePeerTask(logId, note);
      // remove from state queue upon success
      setPendingQueue((prev) => prev.filter((item) => item._id !== logId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to approve task');
    }
  };

  const dispute = async (logId: string, reason: string) => {
    try {
      await disputePeerTask(logId, reason);
      // remove from state queue upon success
      setPendingQueue((prev) => prev.filter((item) => item._id !== logId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to dispute task');
    }
  };

  return {
    pendingQueue,
    loading,
    error,
    refresh: fetchPendingQueue,
    approve,
    dispute,
  };
};