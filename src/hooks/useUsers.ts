import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, archiveUser } from '../services/manageAccountService';
import type { UserAccount } from '../types/manageAccount';

export function useUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We wrap this in useCallback so we can call it again after an update
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once when the component starts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // A helper to handle the archive action and then refresh the UI
  const handleToggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      await archiveUser(id);
      await fetchUsers(); // Refresh the list automatically!
    } catch (err: any) {
      alert(err.message);
    }
  };

  return { users, loading, error, refresh: fetchUsers, handleToggleArchive };
}