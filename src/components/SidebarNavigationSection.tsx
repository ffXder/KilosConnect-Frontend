import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logOut } from "../services/authService";

type Role = "admin" | "custodian";

const navItems = [
  {
    label: "Overview",
    path: "/dashboard",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  },
  {
    label: "Asset Registry",
    path: "/asset-registry",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  },
  {
    label: "Live Task Monitor",
    path: "/task-monitor",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  },
  {
    label: "Manage Tasks",
    path: "/manage-task",
    roles: ["admin"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" ry="1" /></svg>,
  },
  {
    label: "Lost and Found",
    path: "/lost-and-found",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  },
  {
    label: "Incident Report",
    path: "/incident-report",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  },
  {
    label: "Logs",
    path: "/audit-logs",
    roles: ["admin"] as Role[], 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  {
    label: "Profile",
    path: "/profile",
    roles: ["admin", "custodian"] as Role[],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
  {
    label: "Manage Accounts",
    path: "/manage-accounts",
    roles: ["admin"] as Role[], 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    label: "Archives",
    path: "/archives",
    roles: ["admin"] as Role[], 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8"></polyline>
        <rect x="1" y="3" width="22" height="5"></rect>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
    ),
  },
];

export const SidebarNavigationSection: React.FC<{ userRole?: Role }> = ({ userRole }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogoutClick = () => {
    logOut();
    navigate("/login");
  };

  const visibleItems = userRole ? navItems.filter((item) => item.roles.includes(userRole)) : navItems;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="w-[78px] h-screen flex-shrink-0 relative" />

      <aside
        className="fixed top-0 left-0 h-screen bg-[#072821] flex flex-col z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.25)]"
        style={{ 
          width: isExpanded ? "240px" : "78px",
          borderRight: "4px solid #072821" 
        }}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between py-6 px-4">
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "w-[120px] opacity-100" : "w-0 opacity-0"
          }`}>
            <img 
              className="w-full object-contain" 
              alt="Kilos logo" 
              src="https://c.animaapp.com/C3N4JJvt/img/kilos-white-logo-1.png" 
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center justify-center w-9 h-9 rounded-lg text-[#FDFFE0] hover:bg-white/10 transition-colors ${
              !isExpanded ? "mx-auto" : ""
            }`}
          >
            {isExpanded ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 flex flex-col px-4 gap-1.5 overflow-y-auto no-scrollbar" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={!isExpanded ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-[10px] transition-all cursor-pointer border-l-4 py-3 ${
                  isActive
                    ? "bg-white/10 text-[#f5a623] border-[#f5a623]"
                    : "text-[#FDFFE0] hover:bg-white/5 border-transparent"
                } ${!isExpanded ? "justify-center px-0" : "gap-3 px-4"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-[#f5a623]" : "text-[#FDFFE0]"}>
                    {item.icon}
                  </span>
                  
                  <span className={`[font-family:'Poppins',Helvetica] font-medium text-sm leading-5 whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100 scale-100 w-auto" : "opacity-0 scale-90 w-0 pointer-events-none"
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-8">
          <button
            type="button"
            onClick={handleLogoutClick}
            title={!isExpanded ? "Log Out" : undefined}
            className={`flex items-center rounded-[10px] text-[#c8d8d5] hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-transparent py-3 ${
              !isExpanded ? "justify-center px-0" : "gap-3 px-4 w-full"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDFFE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className={`[font-family:'Poppins',Helvetica] font-medium text-[#FDFFE0] text-sm leading-5 whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 scale-100 w-auto" : "opacity-0 scale-90 w-0 pointer-events-none"
            }`}>
              Log Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};