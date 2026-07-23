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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#eef1f3] gap-3">
        <span className="font-semibold text-lg sm:text-xl">User Accounts ({totalAccounts})</span>
        <button 
          type="button"
          onClick={onAddNewUser}
          className="bg-[#0b3026] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#08241d] whitespace-nowrap"
        >
          + Add New User
        </button>
      </div>

      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-[#fafbfc] border border-gray-200 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none"
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
      </div>
    </>
  );
};
