import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, archiveUser } from '../services/manageAccountService';
import type { UserAccount } from '../types/manageAccount';

export function useUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      await archiveUser(id);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return { users, loading, error, refresh: fetchUsers, handleToggleArchive };
}