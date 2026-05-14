import { useState } from "react";
import { InventorySummarySection } from "./sections/InventorySummarySection";
import { LostAndFoundTrackingSection } from "./sections/LostAndFoundTrackingSection";
import { SafetyIncidentReportSection } from "./sections/SafetyIncidentReportSection";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { TaskStatusPanelSection } from "./sections/TaskStatusPanelSection";
import { useAuth } from '../../hooks/useAuth';
import { NotificationAlertBanner } from "./sections/NotifAlertBanner";
import { useConsumables } from "../../hooks/useConsumables";

export const DashboardPage: React.FC = () => {
  const { role, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { consumables } = useConsumables();

  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];
  
  const outOfStockCount = consumables.filter((r: any) => r.quantity === 0).length;
  const lowStockCount = consumables.filter(
    (r: any) => r.quantity > 0 && r.quantity <= (r.lowStockAlert || 0)
  ).length;
  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, slide-in drawer on mobile */}
      <aside
        className={[
          "fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarNavigationSection userRole={userRole} />
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px] overflow-y-auto h-full">

        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-6 pb-4 bg-[#f4f5f6]/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                Dashboard
              </h1>
              <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">
                Welcome back, {user?.firstName || "User"}!
              </p>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 -mb-1">
          <NotificationAlertBanner
            outOfStockCount={outOfStockCount}
            lowStockCount={lowStockCount}
          />
        </div>
        {/* Dashboard Grid */}
        <div className="flex flex-col xl:flex-row flex-1 gap-5 p-4 sm:p-6">

          {/* Left column — stacks on mobile */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">
            <InventorySummarySection />
            <SafetyIncidentReportSection />
            <LostAndFoundTrackingSection />
          </div>

          {/* Right column — full width on mobile, fixed width on xl+ */}
          <div className="w-full xl:w-[300px] xl:flex-shrink-0">
            <TaskStatusPanelSection />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;