export type ActivityType = 'task' | 'incident' | 'asset' | 'lostfound' | 'other';

export interface PerformanceStats {
  tasksCompleted: number;
  incidentsReported: number;
  itemsLogged: number;
  activeDays: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  createdAt: string;
}

export interface MyPerformance {
  stats: PerformanceStats;
  recentActivity: RecentActivity[];
}