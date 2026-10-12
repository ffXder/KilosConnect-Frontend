import { useState, useEffect } from 'react';
import type { TaskLog } from '../types/task';
import { getMySubmissions } from '../services/taskReviewService';

export const useMySubmissions = () => {
  const [submissions, setSubmissions] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setSubmissions(await getMySubmissions());
      } catch (err: any) {
        setError(err.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { submissions, loading, error };
};