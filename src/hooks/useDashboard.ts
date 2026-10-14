import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDashboard } from '../services/dashboardService';
import { getAllReports } from '../services/incidentService';
import { getTaskLogs } from '../services/taskLogService';
import type { DashboardAlert, DashboardData } from '../types/dashboard';
import type { IncidentReport } from '../types/incident';
import type { TaskLog } from '../types/task';
import type { StatCardData } from '../pages/admin/Dashboard/components/StatsSections';

export const ASSET_STATUS_COLORS: Record<string, string> = {
  Working: '#22c55e',
  'Under Repair': '#3b82f6',
  'Needs Repair': '#ffffff',
  'Needs Replacement': '#e11d48',
  Damaged: '#f97316',
  Hazardous: '#dc2626',
  Decommissioned: '#9ca3af',
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashboardResult, reportsResult, taskLogsResult] = await Promise.allSettled([
        getDashboard(),
        getAllReports(),
        getTaskLogs(),
      ]);

      if (dashboardResult.status === 'rejected') {
        throw dashboardResult.reason;
      }

      const dashboard = dashboardResult.value;
      const reportsResponse: unknown =
        reportsResult.status === 'fulfilled' ? reportsResult.value : [];
      const reports: IncidentReport[] = Array.isArray(reportsResponse)
        ? reportsResponse as IncidentReport[]
        : reportsResponse &&
            typeof reportsResponse === 'object' &&
            'incidentReports' in reportsResponse &&
            Array.isArray((reportsResponse as { incidentReports?: unknown }).incidentReports)
          ? (reportsResponse as { incidentReports: IncidentReport[] }).incidentReports
          : [];
      const taskLogsResponse: unknown = taskLogsResult.status === 'fulfilled' ? taskLogsResult.value : [];
      const taskLogs: TaskLog[] = Array.isArray(taskLogsResponse)
        ? taskLogsResponse as TaskLog[]
        : taskLogsResponse &&
            typeof taskLogsResponse === 'object' &&
            'taskLogs' in taskLogsResponse &&
            Array.isArray((taskLogsResponse as { taskLogs?: unknown }).taskLogs)
          ? (taskLogsResponse as { taskLogs: TaskLog[] }).taskLogs
          : [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const incidentAlerts: (DashboardAlert & { at: string })[] = reports
        .filter((report) => report.status !== 'Resolved')
        .map((report) => {
          const populatedAssets = Array.isArray(report.affectedAssets)
            ? report.affectedAssets as unknown[]
            : [];
          const firstAsset = populatedAssets.find(
            (asset): asset is { name: string } =>
              typeof asset === 'object' &&
              asset !== null &&
              'name' in asset &&
              typeof asset.name === 'string'
          );
          const populatedAsset =
            typeof report.asset === 'object' &&
            report.asset !== null &&
            !Array.isArray(report.asset) &&
            typeof report.asset.name === 'string'
              ? report.asset.name
              : undefined;
          return {
            id: report._id,
            source: 'incident' as const,
            asset: populatedAsset || firstAsset?.name || report.title || report.area,
            status: `has an open ${report.severity.toLowerCase()} incident`,
            severity:
              report.severity === 'Critical' || report.severity === 'Urgent'
                ? 'critical' as const
                : 'warning' as const,
            at: report.createdAt ?? report.dateAndTime,
          };
        });

      const taskAlerts: (DashboardAlert & { at: string })[] = taskLogs
        .filter((log) => log.status !== 'Cancelled')
        .map((log) => {
          const isOpen = log.status === 'Pending' || log.status === 'In Progress';
          const isOverdue = isOpen && log.date !== undefined && Date.parse(log.date) < today.getTime();
          let status = 'maintenance scheduled';
          let severity: DashboardAlert['severity'] = 'info';

          if (log.status === 'Completed') {
            status = 'maintenance completed';
            severity = 'success';
          } else if (log.status === 'Missed') {
            status = 'task missed';
            severity = 'critical';
          } else if (isOverdue) {
            status = 'overdue for maintenance';
            severity = 'warning';
          }

          return {
            id: log._id,
            source: 'task',
            task: log.task?.title || 'Maintenance task',
            status,
            severity,
            at: log.createdAt,
          };
        });

      const supplementalAlerts = [...incidentAlerts, ...taskAlerts]
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
        .slice(0, 5)
        .map((alert) => ({
          id: alert.id,
          source: alert.source,
          asset: alert.asset,
          task: alert.task,
          status: alert.status,
          severity: alert.severity,
        }));
      const alerts =
        supplementalAlerts.length > 0 ? supplementalAlerts : dashboard.alerts;

      setData({ ...dashboard, alerts });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    return fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    void Promise.resolve().then(fetchDashboard);
  }, [fetchDashboard]);

  const stats: StatCardData[] = useMemo(() => {
    if (!data) return [];
    const s = data.stats;
    return [
      { label: 'Total Assets', count: s.totalAssets, sublabel: `+${s.addedThisMonth} added this month`, colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700', cardClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' },
      { label: 'Active Incidents', count: s.openIncidents, sublabel: `${s.urgentIncidents} urgent`, colorClass: 'bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700', cardClass: 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800' },
      { label: 'Maintenance Tasks', count: s.pendingTasks, sublabel: `${s.overdueTasks} overdue`, colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-700', cardClass: 'bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800' },
      { label: 'Working Equipment', count: `${s.workingPct}%`, sublabel: `${s.working} of ${s.totalAssets} assets`, colorClass: 'bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-700', cardClass: 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800' },
    ];
  }, [data]);

  const assetStatusData = useMemo(
    () => (data?.assetStatus ?? []).map((s) => ({ ...s, color: ASSET_STATUS_COLORS[s.name] ?? '#94a3b8' })),
    [data]
  );

  return {
    loading,
    error,
    refetch,
    stats,
    assetStatusData,
    totalAssetCount: data?.stats.totalAssets ?? 0,
    maintenanceTrendData: data?.maintenanceTrend ?? [],
    zoneActivityData: data?.zoneActivity ?? [],
    alerts: data?.alerts ?? [],
    replacements: data?.replacements ?? [],
  };
}