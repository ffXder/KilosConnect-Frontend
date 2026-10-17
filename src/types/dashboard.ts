export interface DashboardStats {
  totalAssets: number;
  addedThisMonth: number;
  workingPct: number;
  working: number;
  openIncidents: number;
  urgentIncidents: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface AssetStatusEntry {
  name: string;
  value: number;
}

export interface MaintenanceTrendEntry {
  month: string;
  completed: number;
  pending: number;
}

export interface ZoneActivityEntry {
  zone: string;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface DashboardAlert {
  id?: string;
  asset?: string;
  task?: string;
  status: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  source?: 'incident' | 'task';
}

export interface DashboardReplacement {
  assetName: string;
  repairCost: number;
  srp: number;
  status: 'recommended' | 'monitor' | 'none';
}

export interface DashboardData {
  stats: DashboardStats;
  assetStatus: AssetStatusEntry[];
  maintenanceTrend: MaintenanceTrendEntry[];
  zoneActivity: ZoneActivityEntry[];
  alerts: DashboardAlert[];
  replacements: DashboardReplacement[];
}