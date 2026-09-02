import type { Asset } from './asset';
import type { IncidentReport } from './incident';
import type { LostAndFound } from './lostAndFound';
import type { Task } from './task';
import type { UserAccount } from './manageAccount';

export type ModuleType = 'IncidentReport' | 'Asset' | 'User' | 'Task' | 'LostAndFound';

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

// helper types
export type ArchivedAssetRecord = ArchiveRecord<Asset>;
export type ArchivedIncidentRecord = ArchiveRecord<IncidentReport>;
export type ArchivedLostAndFoundRecord = ArchiveRecord<LostAndFound>;
export type ArchiveTaskRecord = ArchiveRecord<Task>;
export type ArchiveUserRecord= ArchiveRecord<UserAccount>

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

