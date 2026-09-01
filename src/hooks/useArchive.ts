import { useState, useEffect, useCallback } from "react";
import {
  getAllArchives,
  getArchiveStats,
  unarchiveRecord,
} from "../services/archiveService"; // Adjust path to match your service location
import type { ArchiveRecord, ArchiveStats } from "../types/archive";

interface FetchArchiveFilters {
  search?: string;
  moduleType?: string;
}

export function useArchives() {
  const [archives, setArchives] = useState<ArchiveRecord[]>([]);
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Archives with Filter/Search Support
  const fetchArchives = useCallback(async (filters?: FetchArchiveFilters) => {
    setLoading(true);
    try {
      // Clean up filters to avoid sending 'All Types' or empty strings
      const cleanedFilters = {
        search: filters?.search || undefined,
        moduleType:
          filters?.moduleType === "All Types" ? undefined : filters?.moduleType,
      };

      const data = await getAllArchives(cleanedFilters);

      // Safe payload parsing matching Postman response structure
      if (Array.isArray(data)) {
        setArchives(data);
      } else if (data && typeof data === "object" && Array.isArray((data as any).archives)) {
        setArchives((data as any).archives);
      } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
        setArchives((data as any).data);
      } else {
        setArchives([]);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch archive records.");
      setArchives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Archive Stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await getArchiveStats();
      const statsData = (data as any)?.data || data || null;
      setStats(statsData);
    } catch (err: any) {
      console.error("Error loading archive stats:", err.message);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchArchives();
    fetchStats();
  }, [fetchArchives, fetchStats]);

  // 3. Restore Action
  const unarchive = async (id: string): Promise<boolean> => {
    try {
      await unarchiveRecord(id);
      await fetchArchives();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to restore record.");
      return false;
    }
  };

  return {
    archives,
    stats,
    loading,
    error,
    fetchArchives,
    fetchStats,
    unarchive,
    refresh: () => {
      fetchArchives();
      fetchStats();
    },
  };
}