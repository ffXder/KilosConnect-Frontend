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
  const [submittingId, setSubmittingId] = useState<string | null>(null);
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
    setSubmittingId(logId);
    try {
      await approvePeerTask(logId, note);
      setPendingQueue(prev => prev.filter(item => item._id !== logId));
    } finally {
      setSubmittingId(null);
    }
  };

  const dispute = async (logId: string, reason: string) => {
    setSubmittingId(logId);
    try {
      await disputePeerTask(logId, reason);
      setPendingQueue(prev => prev.filter(item => item._id !== logId));
    } finally {
      setSubmittingId(null);
    }
  };

  return {
    pendingQueue,
    loading,
    submittingId,
    error,
    refresh: fetchPendingQueue,
    approve,
    dispute,
  };
};