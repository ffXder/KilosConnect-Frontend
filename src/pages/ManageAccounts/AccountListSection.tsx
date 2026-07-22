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
    <div className="w-full">
      <table className="w-full text-left">
        <thead className="font-semibold text-[#555] text-[11px] uppercase tracking-wider text-left py-2 pr-4">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">User ID</th>
            <th className="px-6 py-4">Username</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date Added</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* --- LOADING STATE --- */}
          {loading && (
            <tr>
              <td colSpan={7} className="py-20">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-100 border-t-[#0b3026] rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-400 font-medium">Loading account data...</p>
                </div>
              </td>
            </tr>
          )}

          {/* --- EMPTY STATE --- */}
          {!loading && accounts.length === 0 && (
            <tr>
              <td colSpan={7} className="py-20">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <User className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-500 font-bold text-base">No accounts found</p>
                  <p className="text-gray-400 text-sm max-w-[250px] mx-auto mt-1">
                    We couldn't find any users matching your current filters.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {/* --- LIST DATA --- */}
          {!loading && accounts.map((acc) => (
            <tr key={acc.userId} className="border-b border-[#eef1f3] text-sm hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0b3026] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {acc.firstName[0]}{acc.lastName[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1a1a1a]">{acc.firstName} {acc.lastName}</span>
                  <span className="text-[#6b6b6b] text-[12px]">{acc.email}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-[#555] text-[12px] font-mono">{acc.userId}</td>
              <td className="px-6 py-4 font-medium">{acc.username}</td>
              <td className="px-6 py-4 text-gray-500">{acc.phoneNumber}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${
                  acc.role === "admin"
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {acc.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1.5 font-bold text-[11px] ${
                  !acc.isArchived ? "text-green-600" : "text-gray-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${!acc.isArchived ? "bg-green-500" : "bg-gray-300"}`} />
                  {acc.isArchived ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-400">{formatDateTime(acc.createdAt)}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => onEditClick(acc)} 
                    className="text-[#0b3026] font-bold text-xs hover:underline decoration-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDeleteClick(acc.userId, acc.firstName)} 
                    className="text-red-500 font-bold text-xs hover:underline decoration-2"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsListSection;