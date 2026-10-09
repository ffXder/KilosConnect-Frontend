import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  Archive,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  QrCode,
  ScrollText,
  Search,
  TriangleAlert,
  UserRound,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import { logOut } from "../services/authService";
import { ThemeToggle } from "./ThemeToggle"

type Role = "admin" | "custodian";

const navItems = [
  {
    label: "Overview",
    path: "/dashboard",
    roles: ["admin"] as Role[],
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Overview",
    path: "/custodian/dashboard",
    roles: ["custodian"] as Role[],
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Scan QR",
    path: "/scan-qr",
    roles: ["custodian"] as Role[],
    icon: <QrCode size={20} />,
  },
  {
    label: "Task Operations",
    path: "/custodian/task-operations",
    roles: ["custodian"] as Role[],
    icon: <ClipboardList size={20} />,
  },
  {
    label: "Buddy System",
    path: "/custodian/buddy-system",
    roles: ["custodian"] as Role[],
    icon: <UsersRound size={20} />,
  },
  {
    label: "Asset Registry",
    path: "/asset-registry",
    roles: ["admin"] as Role[],
    icon: <Boxes size={20} />,
  },
  {
    label: "Live Task Monitor",
    path: "/task-monitor",
    roles: ["admin"] as Role[],
    icon: <Activity size={20} />,
  },
  {
    label: "Manage Tasks",
    path: "/manage-task",
    roles: ["admin"] as Role[],
    icon: <ListChecks size={20} />,
  },
  {
    label: "Lost and Found",
    path: "/lost-and-found",
    roles: ["admin"] as Role[],
    icon: <Search size={20} />,
  },
  {
    label: "Incident Report",
    path: "/incident-report",
    roles: ["admin", "custodian"] as Role[],
    icon: <TriangleAlert size={20} />,
  },
  {
    label: "Logs",
    path: "/audit-logs",
    roles: ["admin"] as Role[], 
    icon: <ScrollText size={20} />,
  },
  {
    label: "Profile",
    path: "/profile",
    roles: ["admin", "custodian"] as Role[],
    icon: <UserRound size={20} />,
  },
  {
    label: "Manage Accounts",
    path: "/manage-accounts",
    roles: ["admin"] as Role[], 
    icon: <UserRoundCog size={20} />,
  },
  {
    label: "Archives",
    path: "/archives",
    roles: ["admin"] as Role[], 
    icon: <Archive size={20} />,
  },
];

export const SidebarNavigationSection: React.FC<{ userRole?: Role }> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar expansion state
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar_expanded");
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const nextState = !prev;
      localStorage.setItem("sidebar_expanded", JSON.stringify(nextState));
      return nextState;
    });
  };

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

      {/* --- MOBILE TOP HEADER --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#072821] flex items-center justify-between px-4 z-40 border-b border-white/10 shadow-md">
        <div className="w-[100px]">
          <img 
            className="w-full object-contain" 
            alt="Kilos logo" 
            src="https://c.animaapp.com/C3N4JJvt/img/kilos-white-logo-1.png" 
          />
        </div>
        
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#FDFFE0] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* --- MOBILE OVERLAY BACKDROP --- */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-45 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* --- DESKTOP SPACER --- */}
      <div 
        className="hidden md:block h-screen flex-shrink-0 relative transition-all duration-300 ease-in-out" 
        style={{ width: isExpanded ? "240px" : "78px" }}
      />

      {/* --- COMBINED NAVIGATION SIDEBAR / DRAWER --- */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#072821] flex flex-col z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.25)]
          ${isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ 
          width: undefined, // Controlled dynamically via CSS media query/styles below
          borderRight: "4px solid #072821" 
        }}
        aria-label="Sidebar navigation"
      >
        {/* Responsive inline dynamic width override for desktop breakpoint */}
        <div className="hidden md:block absolute inset-0 pointer-events-none" style={{ width: isExpanded ? "240px" : "78px" }} />

        {/* Sidebar Header */}
        <div className="flex items-center justify-between py-6 px-4 pt-8 md:pt-6">
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded || isMobileOpen ? "w-[120px] opacity-100" : "w-0 opacity-0"
          }`}>
            <img 
              className="w-full object-contain" 
              alt="Kilos logo" 
              src="https://c.animaapp.com/C3N4JJvt/img/kilos-white-logo-1.png" 
            />
          </div>

          {/* Desktop Collapse Toggle / Mobile Close Toggle */}
          <button
            type="button"
            onClick={isMobileOpen ? () => setIsMobileOpen(false) : toggleSidebar}
            className={`flex items-center justify-center w-9 h-9 rounded-lg text-[#FDFFE0] hover:bg-white/10 transition-colors ${
              !isExpanded && !isMobileOpen ? "mx-auto" : ""
            }`}
          >
            {isExpanded || isMobileOpen ? (
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

        {/* Nav Links List */}
        <nav className="flex-1 flex flex-col px-4 gap-1.5 overflow-y-auto no-scrollbar" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={!isExpanded && !isMobileOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-[10px] transition-all cursor-pointer border-l-4 py-3 ${
                  isActive
                    ? "bg-white/10 text-[#f5a623] border-[#f5a623]"
                    : "text-[#FDFFE0] hover:bg-white/5 border-transparent"
                } ${!isExpanded && !isMobileOpen ? "justify-center px-0" : "gap-3 px-4"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-[#f5a623]" : "text-[#FDFFE0]"}>
                    {item.icon}
                  </span>
                  
                  <span className={`[font-family:'Poppins',Helvetica] font-medium text-sm leading-5 whitespace-nowrap transition-all duration-300 ${
                    isExpanded || isMobileOpen ? "opacity-100 scale-100 w-auto" : "opacity-0 scale-90 w-0 pointer-events-none"
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="px-4 pb-8">
          {/* for dark mode toggle */}
          <ThemeToggle isExpanded={isExpanded} isMobileOpen={isMobileOpen} />
          <button
            type="button"
            onClick={handleLogoutClick}
            title={!isExpanded && !isMobileOpen ? "Log Out" : undefined}
            className={`flex items-center rounded-[10px] text-[#c8d8d5] hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-transparent py-3 ${
              !isExpanded && !isMobileOpen ? "justify-center w-full border-l-0" : "gap-3 px-4 w-full"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDFFE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className={`[font-family:'Poppins',Helvetica] font-medium text-[#FDFFE0] text-sm leading-5 whitespace-nowrap transition-all duration-300 ${
              isExpanded || isMobileOpen ? "opacity-100 scale-100 w-auto" : "opacity-0 scale-90 w-0 pointer-events-none"
            }`}>
              Log Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};