import { useAuth } from '../../hooks/useAuth';
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";

export const DashboardPage: React.FC = () => {
  const { role, user } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen bg-[#f4f5f6]">
      <SidebarNavigationSection userRole={userRole} />

      {/* Main content area */}
      <main className="flex-1 w-full overflow-y-auto  pt-20 md:pt-0">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {/* Header matching Asset Registry font styles */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {user?.firstName || "User"}!
            </p>
          </div>

          {/* Dashboard content goes here */}
          
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;