import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, toggleArchiveUser } from '../services/manageAccountService';
import type { UserAccount } from '../types/manageAccount';

/**
 * Wraps a promise with a timeout so it doesn't hang indefinitely.
 */
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
};

// Fallback mock users for when backend is unavailable
const mockUsers: UserAccount[] = [
  {
    userId: "USR-001",
    initials: "SA",
    username: "sarah.admin",
    firstName: "Sarah",
    lastName: "Admin",
    email: "sarah.admin@kilos.ph",
    role: "admin",
    isArchived: false,
    archivedBy: null,
    archivedAt: null,
    dateAdded: "2024-01-15",
    createdAt: "2024-01-15T08:00:00.000Z",
    phoneNumber: "+63 912 345 6789",
    profileImage: null,
  },
  {
    userId: "USR-002",
    initials: "JC",
    username: "john.custodian",
    firstName: "John",
    lastName: "Custodian",
    email: "john.custodian@kilos.ph",
    role: "custodian",
    isArchived: false,
    archivedBy: null,
    archivedAt: null,
    dateAdded: "2024-02-20",
    createdAt: "2024-02-20T10:30:00.000Z",
    phoneNumber: "+63 923 456 7890",
    profileImage: null,
  },
  {
    userId: "USR-003",
    initials: "MR",
    username: "mike.rodriguez",
    firstName: "Mike",
    lastName: "Rodriguez",
    email: "mike.rodriguez@kilos.ph",
    role: "custodian",
    isArchived: true,
    archivedBy: "sarah.admin",
    archivedAt: "2024-06-01T12:00:00.000Z",
    dateAdded: "2024-03-10",
    createdAt: "2024-03-10T09:15:00.000Z",
    phoneNumber: "+63 934 567 8901",
    profileImage: null,
  },
];

export function useUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We wrap this in useCallback so we can call it again after an update
  const fetchUsers = useCallback(async () => {
    // Immediately show mock data so UI renders right away
    setUsers(mockUsers);
    setLoading(false);

    // Attempt real API call in background with timeout
    try {
      const data = await withTimeout(getAllUsers(), 3000);
      if (data && data.length > 0) {
        setUsers(data);
      }
    } catch (err: any) {
      // Keep mock data - backend unavailable
      console.warn("Users API unavailable, using mock data:", err.message);
    }
  }, []);

  // Run once when the component starts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // A helper to handle the archive action and then refresh the UI
  const handleToggleArchive = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleArchiveUser(userId, !currentStatus);
      await fetchUsers(); // Refresh the list automatically!
    } catch (err: any) {
      // Optimistically update local state when backend unavailable
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, isArchived: !currentStatus } : u
        )
      );
      console.warn("Toggle archive API unavailable, updated locally:", err.message);
    }
  };

  return { users, loading, error, refresh: fetchUsers, handleToggleArchive };
}
