// to get the populated users
export interface User {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuditLogs {
  _id: string;
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'ARCHIVE'
    | 'UNARCHIVE'
    | 'DELETE'
    | 'CLAIM'
    | 'UNCLAIM'
    | 'VIEW'
    | 'GENERATE'
    | 'START'
    | 'COMPLETE'
    | 'MISSED'
    | 'VERIFY_PEER'
    | 'DISPUTE_PEER'
    | 'RESOLVE_DISPUTE'
    | 'CANCEL';
  module:
    | 'User'
    | 'Archive'
    | 'Asset'
    | 'RepairLog'
    | 'LostAndFound'
    | 'IncidentReport'
    | 'TaskTemplate'
    | 'TaskLog';
  targetId: string | null;
  performedBy: User;
  details: string | null;
  createdAt: string;         
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalLogs: number;
}

export interface AuditLogsApiResponse {
  logs: AuditLogs[];
  stats?: Record<string, number>
  pagination: PaginationData;
}