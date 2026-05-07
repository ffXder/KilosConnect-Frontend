import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { useAuth } from "../hooks/useAuth";
export const TaskMonitorPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]  
  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
        
      <SidebarNavigationSection userRole={userRole}/>

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-8">
          <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[36px]">
            Task Tracking
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
              <img src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="px-8 pb-8">
          {/* Stats Cards - Completion Rate Removed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[20px] border border-[#e8e8e8] flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{/*completedCount */}</div>
                <div className="text-xs text-gray-500 font-medium">Completed Today</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#e8e8e8] flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{/*pendingCount*/}</div>
                <div className="text-xs text-gray-500 font-medium">Pending Tasks</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-[20px] p-6 border border-[#e8e8e8] mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button className="px-6 py-2 bg-[#0a2e27] text-white rounded-lg font-medium">All Tasks</button>
                <button className="px-6 py-2 bg-[#f4f5f6] text-gray-600 rounded-lg font-medium hover:bg-gray-200">Pending</button>
                <button className="px-6 py-2 bg-[#f4f5f6] text-gray-600 rounded-lg font-medium hover:bg-gray-200">Completed</button>
              </div>
              <button className="bg-[#0a2e27] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-[#08241f] transition-colors">
                <span className="text-xl">+</span> New Task
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((f) => (
                <button key={f} className={`text-sm font-semibold px-3 py-1 rounded ${f === 'All' ? 'bg-purple-600 text-white' : 'text-blue-500 hover:bg-blue-50'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};