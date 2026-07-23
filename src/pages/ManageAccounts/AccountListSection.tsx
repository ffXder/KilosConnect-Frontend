 import React from "react";
import { User, ShieldAlert, Search } from "lucide-react"; // Assuming you use lucide-react, otherwise use your AccountsIcons
import type { UserAccount } from "../../types/manageAccount";
import { formatDateTime } from "../../utils/formatter";

interface AccountsListSectionProps {
  accounts: UserAccount[];
  loading?: boolean;
  onEditClick: (account: UserAccount) => void;
  onDeleteClick: (id: string, name: string) => void;
}

const AccountsListSection: React.FC<AccountsListSectionProps> = ({ 
  accounts, 
  loading,
  onEditClick, 
  onDeleteClick 
}) => {
  return (
    <>
      {/* ===== MOBILE CARD VIEW (below sm breakpoint) ===== */}
      <div className="sm:hidden divide-y divide-gray-100">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#0b3026] rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400 font-medium text-sm">Loading account data...</p>
          </div>
        )}
        {!loading && accounts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <User className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-bold text-base">No accounts found</p>
            <p className="text-gray-400 text-sm max-w-[250px] mx-auto mt-1">We couldn't find any users matching your current filters.</p>
          </div>
        )}
        {!loading && accounts.map((acc) => (
          <div key={acc.userId} className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0b3026] text-white flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0">
                  {acc.firstName[0]}{acc.lastName[0]}
                </div>
                <div>
                  <div className="font-bold text-[#1a1a1a] text-sm">{acc.firstName} {acc.lastName}</div>
                  <div className="text-[#6b6b6b] text-[11px]">{acc.email}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                acc.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-600"
              }`}>
                {acc.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] bg-gray-50 rounded-lg p-3">
              <div>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider block">User ID</span>
                <span className="text-[#555] font-mono font-semibold whitespace-nowrap">{acc.userId}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Username</span>
                <span className="text-[#1a1a1a] font-medium">{acc.username}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Phone</span>
                <span className="text-gray-500 font-mono whitespace-nowrap">{acc.phoneNumber}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider block">Status</span>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${!acc.isArchived ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className={`font-semibold text-[11px] ${!acc.isArchived ? "text-green-600" : "text-gray-400"}`}>
                    {acc.isArchived ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <button onClick={() => onEditClick(acc)} className="text-[#0b3026] font-bold text-xs hover:underline">Edit</button>
              <button onClick={() => onDeleteClick(acc.userId, acc.firstName)} className="text-red-500 font-bold text-xs hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DESKTOP TABLE VIEW (sm and above) ===== */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full text-left min-w-[900px] lg:min-w-[1000px]">
          <thead className="font-semibold text-[#555] text-[10px] sm:text-[11px] uppercase tracking-wider">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">Name</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[180px]">User ID</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">Username</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[190px]">Phone</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">Role</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">Status</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">Date</th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="py-10 sm:py-20">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-100 border-t-[#0b3026] rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-400 font-medium text-sm">Loading account data...</p>
                  </div>
                </td>
              </tr>
            )}
            {!loading && accounts.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 sm:py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <User className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-500 font-bold text-base">No accounts found</p>
                    <p className="text-gray-400 text-sm max-w-[250px] mx-auto mt-1">We couldn't find any users matching your current filters.</p>
                  </div>
                </td>
              </tr>
            )}
            {!loading && accounts.map((acc) => (
              <tr key={acc.userId} className="border-b border-[#eef1f3] text-sm hover:bg-gray-50/50 transition-colors group">
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0b3026] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                      {acc.firstName[0]}{acc.lastName[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[#1a1a1a] text-sm truncate">{acc.firstName} {acc.lastName}</span>
                      <span className="text-[#6b6b6b] text-[12px] truncate">{acc.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[#555] text-[12px] font-mono whitespace-nowrap">{acc.userId}</td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-sm whitespace-nowrap">{acc.username}</td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-500 text-sm whitespace-nowrap">{acc.phoneNumber}</td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${
                    acc.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-600"
                  }`}>
                    {acc.role}
                  </span>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <span className={`flex items-center gap-1.5 font-bold text-[11px] ${
                    !acc.isArchived ? "text-green-600" : "text-gray-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${!acc.isArchived ? "bg-green-500" : "bg-gray-300"}`} />
                    {acc.isArchived ? "Inactive" : "Active"}
                  </span>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-400 text-xs hidden lg:table-cell">{formatDateTime(acc.createdAt)}</td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => onEditClick(acc)} className="text-[#0b3026] font-bold text-xs hover:underline decoration-2">Edit</button>
                    <button onClick={() => onDeleteClick(acc.userId, acc.firstName)} className="text-red-500 font-bold text-xs hover:underline decoration-2">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
</table>
      </div>
    </>
  );
};

export default AccountsListSection;
