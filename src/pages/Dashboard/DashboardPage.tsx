import { AssetInventorySummarySection } from "./sections/AssetInventoryDash";
import { LostAndFoundTrackingSection } from "./sections/LostAndFoundTrackingSection";
import { SafetyIncidentReportSection } from "./sections/SafetyIncidentReportSection";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { TaskStatusPanelSection } from "./sections/TaskStatusPanelSection";
import { useAuth } from '../../hooks/useAuth'

export const DashboardPage : React.FC = () => {
  const { role, user } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      {/* Fixed Sidebar */}
      <SidebarNavigationSection userRole={userRole} />

      {/* Main content - scrollable */}
      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pt-8 pb-4 bg-white border-b border-[#e8e8e8]">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[36px] leading-tight m-0 p-0">
              Dashboard
            </h1>
            <p className="mt-0.5 [font-family:'Poppins',Helvetica] font-normal text-[#6b6b6b] text-base leading-normal m-0 p-0">
              Welcome, {user?.firstName || "User"}!
            </p>
          </div>  
        </header>

        {/* Body */}
        <div className="flex flex-1 gap-5 p-6 min-h-0">
          {/* Left column */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">
            <AssetInventorySummarySection />
            <SafetyIncidentReportSection />
            <LostAndFoundTrackingSection />
          </div>

          {/* Right: Task panel */}
          <div className="flex-shrink-0 w-[300px]">
            <TaskStatusPanelSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage