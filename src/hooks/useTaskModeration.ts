// for admin review!
import { useState, useEffect, useCallback } from 'react';
import type { TaskLog } from '../types/task';
import { 
  getDisputedQueue, 
  resolveDispute 
} from '../services/taskModerationService';

export const useTaskModeration = () => {
  const [disputedQueue, setDisputedQueue] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisputedQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDisputedQueue();
      setDisputedQueue(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load disputed queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisputedQueue();
  }, [fetchDisputedQueue]);

  const resolve = async (
    logId: string, 
    resolution: 'APPROVE' | 'REJECT', 
    adminNote?: string
  ) => {
    try {
      await resolveDispute(logId, resolution, adminNote);
      // remove resolved log from admin queue
      setDisputedQueue((prev) => prev.filter((item) => item._id !== logId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to resolve dispute');
    }
  };

  return {
    disputedQueue,
    loading,
    error,
    refresh: fetchDisputedQueue,
    resolve,
  };
};