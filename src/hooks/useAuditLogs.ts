import { useState, useEffect, useCallback } from "react";
import { getAllAuditLogs } from "../services/logsService";
import type { 
  AuditLogs, 
  PaginationData, 
  AuditLogsApiResponse 
} from "../types/auditLogs";

export interface AuditLogFilters {
  search?: string;
  type?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
}

export const useAuditLogs = (filters: AuditLogFilters = {}) => {
  const [logs, setLogs] = useState<AuditLogs[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // pass the filters object to the API service layer
      const data: AuditLogsApiResponse = await getAllAuditLogs(filters);

      if (data && typeof data === "object") {
        setLogs(Array.isArray(data.logs) ? data.logs : []);
        setStats(data.stats || {});

        // stores pagination metadata returned from server
        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage || 1,
            totalPages: data.pagination.totalPages || 1,
            totalLogs: data.pagination.totalLogs || 0,
          });
        }
      } else if (Array.isArray(data)) {
        setLogs(data);
        setStats({});
      } else {
        setLogs([]);
        setStats({});
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.search,
    filters.type,
    filters.date,
    filters.startDate,
    filters.endDate,
    filters.page,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, stats, pagination, isLoading, error, refresh: fetchLogs };
};