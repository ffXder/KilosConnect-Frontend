import { useAuth } from '../../hooks/useAuth';
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { useSidebar } from "../../contexts/SidebarContext";
import DashboardStatsSection from "./DashboardStatsSection";
import DashboardBarChart from "./DashboardBarChart";
import DashboardPieChart from "./DashboardPieChart";
import DashboardBellCurve from "./DashboardBellCurve";
import DashboardAlertsSection from "./DashboardAlertsSection";
import DashboardReplacementRecommendations from "./DashboardReplacementRecommendations";

export const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  const { isExpanded } = useSidebar();
  const sidebarMargin = isExpanded ? "lg:ml-[240px]" : "ml-[78px]";

  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      <main
        className={`flex-1 w-full p-4 lg:p-8 transition-all duration-300 overflow-x-hidden ${sidebarMargin}`}
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              Analytical Dashboard
            </h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">
              Real-time facility oversight and predictive analytics
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <DashboardStatsSection />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Trends - Bar Chart */}
          <DashboardBarChart />

          {/* Asset Status Distribution - Pie Chart */}
          <DashboardPieChart />
        </div>

        {/* Charts Row 2: Activity by Zone + Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Activity by Zone - Bell Curve Chart */}
          <DashboardBellCurve />

          {/* Recent Alerts */}
          <DashboardAlertsSection />
        </div>

        {/* Predictive Replacement Recommendations */}
        <DashboardReplacementRecommendations />
      </main>
    </div>
  );
};

export default DashboardPage;

