import { useState, useEffect, useCallback } from "react";
import {
  getAllArchives,
  getArchiveStats,
  unarchiveRecord,
} from "../services/archiveService"; // Adjust path to match your service location
import type { ArchiveRecord, ArchiveStats } from "../types/archive";
import type { ArchivePagination } from "../services/archiveService";

interface FetchArchiveFilters {
  search?: string;
  moduleType?: string;
  page?: number;
}

export function useArchives() {
  const [archives, setArchives] = useState<ArchiveRecord[]>([]);
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [pagination, setPagination] = useState<ArchivePagination>({
    totalArchives: 0,
    totalPages: 1,
    currentPage: 1,
  });
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
        page: filters?.page,
      };

      const data = await getAllArchives(cleanedFilters);

      setArchives(Array.isArray(data.archives) ? data.archives : []);
      setPagination({
        totalArchives: data.pagination?.totalArchives ?? 0,
        totalPages: data.pagination?.totalPages ?? 1,
        currentPage: data.pagination?.currentPage ?? cleanedFilters.page ?? 1,
      });

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
  const unarchive = async (id: string, filters?: FetchArchiveFilters): Promise<boolean> => {
    try {
      await unarchiveRecord(id);
      await fetchArchives(filters);
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
    pagination,
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