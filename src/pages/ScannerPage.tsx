import React, { useState } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { useAuth } from "../hooks/useAuth";
import QRScanner from "../components/QRScanner";

export const ScannerPage = () => {
  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole}/>
      
      {/* Main content area that handles scrolling for the whole page */}
      <div className="flex flex-col flex-1 min-w-0 ml-0 md:ml-[240px] overflow-y-auto h-full transition-all">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-6 sm:pt-8 pb-4 bg-[#f8fafc]/80 backdrop-blur-md">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              QR Code Scanner 
            </h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-xs sm:text-sm mt-0.5">
              Scan QR codes to access asset information!
            </p>
          </div>
        </header>

        <div className="p-4 sm:p-8 flex items-center justify-center">
        </div>
      </div>
    </div>
  );
};