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
  action: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'UNARCHIVE' | 'DELETE' | 'CLAIM' | 'UNCLAIM' | 'VIEW' | 'COMPLETE' | 'MISSED';
  module: 'Asset' | 'Consumable' | 'Inventory' | 'LostAndFound' | 'IncidentReport' | 'Task';
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