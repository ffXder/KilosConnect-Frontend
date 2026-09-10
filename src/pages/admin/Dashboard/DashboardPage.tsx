import { useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAssets } from '../../../hooks/useAssets';
import { useIncidentReports } from '../../../hooks/useIncident';
import { useTaskLogs } from '../../../hooks/useTaskLog';
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import DashboardStatsSection from "./components/StatsSections";
import DashboardBarChart from "./components/BarChart";
import DashboardPieChart from "./components/PieChart";
import DashboardBellCurve from "./components/BellCurve";
import DashboardAlertsSection from "./components/AlertsSection";
import DashboardReplacementRecommendations from "./components/ReplacementRecommendations";

const ASSET_STATUS_COLORS: Record<string, string> = {
  Working: '#22c55e',
  'Under Repair': '#3b82f6',
  'Needs Repair': '#ffffff',
  Damaged: '#f97316',
  Hazardous: '#dc2626',
  Decommissioned: '#9ca3af',
};

const DISPLAYED_ASSET_STATUS_ORDER = [
  'Working',
  'Under Repair',
  'Needs Repair',
  'Damaged',
  'Hazardous',
  'Decommissioned',
];

export const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  const { assets } = useAssets();
  const { reports: incidentReports } = useIncidentReports();
  const { logs: taskLogs } = useTaskLogs();

  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  const assetStatusData = useMemo(() => {
    const activeAssets = assets.filter((asset) => !asset.isArchived);
    const counts: Record<string, number> = {};

    activeAssets.forEach((asset) => {
      const condition = asset.condition || 'Working';
      if (!DISPLAYED_ASSET_STATUS_ORDER.includes(condition)) return;
      counts[condition] = (counts[condition] ?? 0) + 1;
    });

    return DISPLAYED_ASSET_STATUS_ORDER.flatMap((status) => {
      const value = counts[status] ?? 0;
      if (value === 0) return [];

      return [{
        name: status,
        value,
        color: ASSET_STATUS_COLORS[status] ?? '#94a3b8',
      }];
    });
  }, [assets]);

  const maintenanceTrendData = useMemo(() => {
    const today = new Date();
    const monthHeaders = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - (4 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleString('en-US', { month: 'short' }),
      };
    });

    const monthCounts = new Map(
      monthHeaders.map(({ key, month }) => [key, { month, completed: 0, pending: 0 }])
    );

    taskLogs.forEach((log) => {
      const createdAt = log.createdAt ? new Date(log.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return;

      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const monthEntry = monthCounts.get(key);
      if (!monthEntry) return;

      if (log.status === 'Completed') {
        monthEntry.completed += 1;
      } else {
        monthEntry.pending += 1;
      }
    });

    return monthHeaders.map(({ key, month }) => {
      const entry = monthCounts.get(key) ?? { month, completed: 0, pending: 0 };
      const total = entry.completed + entry.pending;

      return {
        month,
        completed: total > 0 ? Math.round((entry.completed / total) * 100) : 0,
        pending: total > 0 ? Math.round((entry.pending / total) * 100) : 0,
      };
    });
  }, [taskLogs]);

  const zoneActivityData = useMemo(() => {
    const areaMap = new Map<string, { open: number; resolved: number }>();

    incidentReports
      .filter((incident) => !incident.isArchived)
      .forEach((incident) => {
        const area = incident.area || 'Unassigned';
        const existing = areaMap.get(area) ?? { open: 0, resolved: 0 };

        if (incident.status === 'Resolved') {
          existing.resolved += 1;
        } else {
          existing.open += 1;
        }

        areaMap.set(area, existing);
      });

    return Array.from(areaMap.entries())
      .map(([zone, values]) => ({ zone, open: values.open, resolved: values.resolved }))
      .sort((a, b) => b.open + b.resolved - (a.open + a.resolved));
  }, [incidentReports]);

  const totalAssetCount = assetStatusData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />
      <main
        className={`flex-1 w-full p-4 lg:p-8 transition-all duration-300 overflow-x-hidden`}
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight dark:text-slate-50 font-bold">
              Analytical Dashboard
            </h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5 dark:text-slate-300">
              Real-time facility oversight and predictive analytics
            </p>
          </div>
        </div>

        <DashboardStatsSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardBarChart
            data={maintenanceTrendData}
            title="Maintenance Trends"
            subtitle="Completed vs pending maintenance over the last 5 months"
          />

          <DashboardPieChart
            data={assetStatusData}
            total={totalAssetCount}
            title="Asset Status Distribution"
            subtitle="Current condition breakdown of all assets"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardBellCurve data={zoneActivityData} />
          <DashboardAlertsSection />
        </div>

        <DashboardReplacementRecommendations />
      </main>
    </div>
  );
};

export default DashboardPage;