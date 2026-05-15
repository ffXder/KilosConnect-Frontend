// ManageAccountsModule/AccountsStatsSection.tsx
import React from "react";

export const AccountsStatsSection: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-between gap-3 px-4 pt-16 pb-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8 lg:pt-6">
      <div>
        <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Manage Accounts</h1>
        <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">Add, edit, and manage user accounts</p>
      </div>
      
    </header>
  );
};

