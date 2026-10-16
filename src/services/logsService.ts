import type { AuditLogsApiResponse } from "../types/auditLogs";
import { apiRequest } from "./authService";

interface AuditLogFilters {
  search?: string;
  type?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  action?: string;
  sortBy?: string;
  sortOrder?: string;
}

// GET
export const getAllAuditLogs = async (filters: AuditLogFilters = {}): Promise<AuditLogsApiResponse> => {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.type && filters.type !== "All") queryParams.append("type", filters.type);
  if (filters.date && filters.date !== "All" && filters.date !== "All Dates") queryParams.append("date", filters.date);
  if (filters.startDate) queryParams.append("startDate", filters.startDate);
  if (filters.endDate) queryParams.append("endDate", filters.endDate);
  if (filters.page) queryParams.append("page", String(filters.page));
  if (filters.action && filters.action !== "All Actions") queryParams.append("action", filters.action);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/audit-logs?${queryString}` : '/audit-logs';

  const res = await apiRequest(endpoint, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Could not load logs');
  }

  return await res.json();
};