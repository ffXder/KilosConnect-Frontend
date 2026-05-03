import React, { useState } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { useInventory } from "../hooks/useInventory";
import { X, Wrench, Layers, Search, Plus } from "lucide-react";
import { useAuth } from '../hooks/useAuth'

export const InventoryPage: React.FC = () => {
  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden relative">
      <SidebarNavigationSection userRole={userRole} />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between px-4 md:px-8 py-6 gap-4">
          <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-2xl md:text-[36px]">
            Inventory
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden shrink-0">
              <img src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
       </div>
    </div>
  );
};