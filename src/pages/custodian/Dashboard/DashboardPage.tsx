import React, { useMemo, useState, useEffect } from "react";
import { useAuth, } from '../../../hooks/useAuth';
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";

export const DashboardPage: React.FC = () => {

  const [sidebarExpanded, setSidebarExpanded] = useState(
            JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
          );
        
          useEffect(() => {
            const syncSidebar = () => {
              setSidebarExpanded(
                JSON.parse(localStorage.getItem("sidebar_expanded") || "false")
              );
            };
        
            const interval = setInterval(syncSidebar, 100);
        
            return () => clearInterval(interval);
          }, []);
    
      const { role, user } = useAuth()
      const userRole =
          (role ?? "admin") as React.ComponentProps<
            typeof SidebarNavigationSection
          >["userRole"];
    
      return (
        <div className="min-h-screen bg-[#F5F7FB] flex">
          <SidebarNavigationSection userRole={userRole} />
          <div
                      className={`transition-all duration-1000 p-8 flex-1 ${
                        sidebarExpanded
                          ? "md:ml-[15px]"
                          : "md:ml-[10px]"
                      }`}
                    >
          <main className="mb-6 ">
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
    </div>
  );
};

export default DashboardPage;