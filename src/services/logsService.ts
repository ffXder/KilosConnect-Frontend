import type { AuditLogs } from "../types/auditLogs";
import { apiRequest } from "./authService";

//GET
export const getAllAuditLogs = async (): Promise<AuditLogs[]> => {
    const res = await apiRequest('/audit-logs', { method: 'GET' })

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load logs');
    }

    return await res.json();
}