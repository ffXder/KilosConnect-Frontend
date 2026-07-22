export interface AuditLogs {
  _id: string;
  action: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'UNARCHIVE' | 'DELETE' | 'CLAIM' | 'UNCLAIM' | 'VIEW' | 'COMPLETE' | 'MISSED';
  module: 'Asset' | 'Consumable' | 'Inventory' | 'LostAndFound' | 'IncidentReport' | 'Task';
  targetId: string | null;
  performedBy: string | null;
  details: string | null;
  createdAt: string;         
  updatedAt: string;
}