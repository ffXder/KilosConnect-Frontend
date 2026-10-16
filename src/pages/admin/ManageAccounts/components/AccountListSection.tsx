import React from "react";
import { User, Edit3, Trash2, Loader2, ShieldCheck } from "lucide-react";
import type { UserAccount } from "../../../../types/manageAccount";
import { formatDateTime } from "../../../../utils/formatter";

interface AccountsListSectionProps {
  accounts: UserAccount[];
  loading?: boolean;
  onEditClick: (account: UserAccount) => void;
  onDeleteClick: (id: string, name: string) => void;
  onPermissionsClick?: (account: UserAccount) => void;
}

const COLUMNS = [
  "Name",
  "User ID",
  "Username",
  "Phone number",
  "Role",
  "Date added",
];

const roleBadge = (role: UserAccount["role"]) => {
  if (role === "super_admin") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  }

  return role === "admin"
    ? "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
    : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
};

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2";

const AccountsListSection: React.FC<AccountsListSectionProps> = ({
  accounts,
  loading,
  onEditClick,
  onDeleteClick,
  onPermissionsClick,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-gray-50/80 border-b border-[#eef1f3] dark:bg-slate-800/50 dark:border-slate-700 transition-colors duration-300">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-xs font-medium text-gray-500 whitespace-nowrap dark:text-slate-400"
              >
                {col}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium text-gray-500 text-right dark:text-slate-400"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#eef1f3] dark:divide-slate-700">
          {/* Loading */}
          {loading && (
            <tr>
              <td colSpan={7} className="px-6 py-20">
                <div
                  role="status"
                  className="flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-slate-400"
                >
                  <Loader2 size={28} className="animate-spin text-[#0b3026] dark:text-emerald-500" />
                  <p className="text-sm font-medium">Loading account data...</p>
                </div>
              </td>
            </tr>
          )}

          {/* Empty */}
          {!loading && accounts.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-20">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-gray-50 p-4 dark:bg-slate-800">
                    <User className="text-gray-300 dark:text-slate-500" size={28} />
                  </div>
                  <p className="text-base font-semibold text-gray-700 dark:text-slate-200">
                    No accounts found
                  </p>
                  <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-slate-400">
                    We couldn't find any users matching your search.
                  </p>
                </div>
              </td>
            </tr>
          )}

          {/* Rows */}
          {!loading &&
            accounts.map((acc) => {
              const fullName = `${acc.firstName} ${acc.lastName}`;
              const initials = `${acc.firstName?.[0] ?? ""}${acc.lastName?.[0] ?? ""}`.toUpperCase();
              const roleLabel =
                acc.role === "super_admin"
                  ? "Super admin"
                  : acc.role.charAt(0).toUpperCase() + acc.role.slice(1);

              return (
                <tr
                  key={acc.userId}
                  className="transition-colors hover:bg-gray-50/70 dark:hover:bg-slate-800/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b3026] text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#1a1a1a] dark:text-slate-100">
                          {fullName}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                          {acc.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600 whitespace-nowrap dark:text-slate-300">
                    {acc.userId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-slate-200">
                    {acc.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap dark:text-slate-300">
                    {acc.phoneNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge(acc.role)}`}
                    >
                      {roleLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap dark:text-slate-400">
                    {formatDateTime(acc.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      {onPermissionsClick && (
                        <button
                          type="button"
                          onClick={() => onPermissionsClick(acc)}
                          aria-label={`Change permissions for ${fullName}`}
                          title="Permissions"
                          className={`${iconButton} text-amber-600 hover:bg-amber-50 hover:text-amber-700 focus-visible:ring-amber-400/40 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300`}
                        >
                          <ShieldCheck size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEditClick(acc)}
                        aria-label={`Edit ${fullName}`}
                        title="Edit"
                        className={`${iconButton} text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-400/40 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(acc._id, fullName)}
                        aria-label={`Delete ${fullName}`}
                        title="Delete"
                        className={`${iconButton} text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-400/40 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsListSection;