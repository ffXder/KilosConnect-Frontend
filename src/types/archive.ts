export type ModuleType = 'Incident' | 'Asset' | 'User' | 'Task' | 'LostAndFound';

export interface ArchiveRecord<T = Record<string, any>> {
  _id: string;
  archiveId: string;
  moduleType: ModuleType;
  originalId: string;
  data: T; // store the data of the archived document
  archivedBy: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchiveStats {
  total: number;
  byModule: Record<ModuleType, number>;
}

export interface ArchiveQueryParams {
  moduleType?: ModuleType;
  search?: string;
  page?: number;
  limit?: number;
}