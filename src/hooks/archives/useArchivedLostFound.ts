import { useState, useEffect, useCallback } from 'react';
import { getArchivedItems, unarchiveLostAndFound } from '../../services/lostAndFoundService';
import type { LostAndFound } from '../../types/lostAndFound';

export function useArchivedLostFound() {
  const [archivedItems, setArchivedItems] = useState<LostAndFound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArchivedItems();
      setArchivedItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedItems();
  }, [fetchArchivedItems]);

  const handleUnarchive = async (id: string) => {
    try {
      await unarchiveLostAndFound(id);
      await fetchArchivedItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return { archivedItems, loading, error, refresh: fetchArchivedItems, handleUnarchive };
}