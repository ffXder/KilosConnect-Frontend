import { useState, useEffect, useCallback } from 'react';
import { getArchivedUsers, unarchiveUser } from '../../services/manageAccountService';
import type { UserAccount } from '../../types/manageAccount';

export function useArchivedUsers() {
  const [archivedUsers, setArchivedUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArchivedUsers();
      setArchivedUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedUsers();
  }, [fetchArchivedUsers]);

  const handleUnarchive = async (userId: string) => {
    try {
      await unarchiveUser(userId);
      await fetchArchivedUsers(); // refresh list after restoring
    } catch (err: any) {
      alert(err.message);
    }
  };

  return { archivedUsers, loading, error, refresh: fetchArchivedUsers, handleUnarchive };
}