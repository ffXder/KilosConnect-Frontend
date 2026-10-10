import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDashboard } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard';
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
      setLoading(true);
      setError(null);
      setData(await getDashboard());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats: StatCardData[] = useMemo(() => {
    if (!data) return [];
    const s = data.stats;
    return [
      { label: 'Total Assets', count: s.totalAssets, sublabel: `+${s.addedThisMonth} added this month`, colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-200' },
      { label: 'Active Incidents', count: s.openIncidents, sublabel: `${s.urgentIncidents} urgent`, colorClass: 'bg-red-100 text-red-600 dark:bg-red-200' },
      { label: 'Maintenance Tasks', count: s.pendingTasks, sublabel: `${s.overdueTasks} overdue`, colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-200' },
      { label: 'Working Equipment', count: `${s.workingPct}%`, sublabel: `${s.working} of ${s.totalAssets} assets`, colorClass: 'bg-green-100 text-green-600 dark:bg-green-200' },
    ];
  }, [data]);

  const assetStatusData = useMemo(
    () => (data?.assetStatus ?? []).map((s) => ({ ...s, color: ASSET_STATUS_COLORS[s.name] ?? '#94a3b8' })),
    [data]
  );

  return {
    loading,
    error,
    refetch: fetchDashboard,
    stats,
    assetStatusData,
    totalAssetCount: data?.stats.totalAssets ?? 0,
    maintenanceTrendData: data?.maintenanceTrend ?? [],
    zoneActivityData: data?.zoneActivity ?? [],
    alerts: data?.alerts ?? [],
    replacements: data?.replacements ?? [],
  };
}