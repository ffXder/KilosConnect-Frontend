import React from "react";

interface AccountsFilterSectionProps {
  totalAccounts: number;
  onSearchChange: (value: string) => void;
  onAddNewUser: () => void;
}

export const AccountsFilterSection: React.FC<AccountsFilterSectionProps> = ({
  totalAccounts,
  onSearchChange,
  onAddNewUser
}) => {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#eef1f3] dark:border-slate-700">
        <span className="font-semibold text-xl dark:text-slate-100">User Accounts ({totalAccounts})</span>
        <button 
          type="button" // Explicitly button to prevent form triggers
          onClick={onAddNewUser}
          className="bg-[#0b3026] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#08241d]"
        >
          + Add New User
        </button>
      </div>

      <div className="px-6 py-3">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full h-10 bg-[#fafbfc] border border-gray-200 rounded-lg px-3 text-sm focus:outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
          onChange={(e) => onSearchChange(e.target.value)}
          // Prevent 'Enter' key from triggering parent form submits
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
      </div>
    </>
  );
};
