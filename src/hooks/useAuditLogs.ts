import { useState, useEffect, useCallback } from "react";
import { getAllAuditLogs } from "../services/logsService";
import type { AuditLogs } from "../types/auditLogs";

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllAuditLogs();
      setLogs(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, isLoading, error, refresh: fetchLogs };
};