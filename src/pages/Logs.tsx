import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { useAuth } from "../hooks/useAuth";

export const LogsPage : React.FC = () => {
  const { role } = useAuth();
    const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]
  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      {/* Fixed Sidebar */}
      <SidebarNavigationSection userRole={userRole}/>

      {/* Main content - scrollable */}
      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pt-8 pb-4 bg-white border-b border-[#e8e8e8]">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[36px] leading-tight m-0 p-0">
              Logs
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <img
                className="w-6 h-6 object-contain"
                alt="Notifications"
                src="https://c.animaapp.com/C3N4JJvt/img/notification@2x.png"
              />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors cursor-pointer"
              aria-label="Open profile menu"
            >
              <img
                className="w-8 h-8 object-cover rounded-full"
                alt="Profile"
                src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png"
              />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 gap-5 p-6 min-h-0">
          {/* Left column */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">
          </div>

          {/* Right: Task panel */}
          <div className="flex-shrink-0 w-[300px]">
          </div>
        </div>
      </div>
    </div>
  );
};
