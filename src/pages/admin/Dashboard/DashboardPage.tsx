import { useAuth } from '../../../hooks/useAuth';
import { useDashboard } from '../../../hooks/useDashboard';
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import DashboardStatsSection from "./components/StatsSections";
import DashboardBarChart from "./components/BarChart";
import DashboardPieChart from "./components/PieChart";
import DashboardBellCurve from "./components/BellCurve";
import DashboardAlertsSection from "./components/AlertsSection";
import DashboardReplacementRecommendations from "./components/ReplacementRecommendations";

export const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  const d = useDashboard();

  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-app)]">
      <SidebarNavigationSection userRole={userRole} />
      <main className="flex-1 w-full p-4 lg:p-8 transition-all duration-300 overflow-x-hidden">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight leading-tight">
              Analytical Dashboard
            </h1>
            <p className="text-[--var(--text)] text-sm mt-0.5">
              Real-time facility oversight and predictive analytics
            </p>
          </div>
        </div>

        {d.error && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {d.error}
            <button onClick={d.refetch} className="font-semibold underline">Retry</button>
          </div>
        )}

        {!d.loading && <DashboardStatsSection stats={d.stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardAlertsSection alerts={d.alerts} />
          <DashboardPieChart
            data={d.assetStatusData}
            total={d.totalAssetCount}
            title="Asset Status Distribution"
            subtitle="Current condition breakdown of all assets"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardBellCurve data={d.zoneActivityData} />
          <DashboardBarChart
            data={d.maintenanceTrendData}
            title="Maintenance Trends"
            subtitle="Completed vs pending maintenance over the last 5 months"
          />
        </div>

        <DashboardReplacementRecommendations replacements={d.replacements} />
      </main>
    </div>
  );
};

export default DashboardPage;