import React, { useMemo, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AlertCircle, X } from "lucide-react";

// HOOKS
import { useAuth } from "../../../hooks/useAuth";
import { usePermissions } from "../../../hooks/usePermissons";

//COMPONENTS
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import type { UserAccount, NewUserForm } from "../../../types/manageAccount";
import {
  AccountsFilterSection,
  type AccountRoleFilter,
  type AccountSortDirection,
  type AccountSortField,
} from "./components/AccountFilterSection";
import AccountsListSection, { ACCOUNTS_PAGE_SIZE } from "./components/AccountListSection";
import { AccountStatsSection } from "./components/AccountStatsSection";
import { useUsers } from "../../../hooks/useUsers";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal";
import { AddUserModal } from "./components/AddUserModal";
import { EditUserModal } from "./components/EditUserModal";
import { PermissionsModal } from "./components/PermissionModal";

// SERVICES
import {
  createUser,
  updateUser,
  resetUserPassword,
  updateUserPermissions,
} from "../../../services/manageAccountService";

// CONSTANTS
import { PERMISSIONS as P } from '../../../constants/permission'

const CLOSED_DELETE = { isOpen: false, id: "", name: "" };

export const ManageAccountsPage: React.FC = () => {
  const { role, userId: currentUserId } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  if (!hasPermission(P.USERS_READ)) {
    return <Navigate to="/unauthorize" replace />;
  }

  const userRole = (role ?? "custodian") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  const canManagePermissions = (role as string) === "super_admin";

  const { users, refresh, handleToggleArchive } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AccountRoleFilter>("all");
  const [sortBy, setSortBy] = useState<AccountSortField>("name");
  const [sortDirection, setSortDirection] = useState<AccountSortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] =
    useState<UserAccount | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string }>(
    CLOSED_DELETE
  );
  const [pageError, setPageError] = useState<string | null>(null);
  const [tempPasswordNotice, setTempPasswordNotice] = useState<{
    name: string;
    password: string;
  } | null>(null);

  const handleAddSubmit = async (data: Omit<NewUserForm, "password">) => {
    await createUser(data as NewUserForm);
    await refresh();
  };

  const handleEditSubmit = async (userId: string, data: Partial<NewUserForm>) => {
    await updateUser(userId, data);
    await refresh();
  };

  const handleResetPassword = async (id: string) => {
    const result = await resetUserPassword(id);

    // backend only returns tempPassword when the email failed to send
    if (result.tempPassword) {
      const target = users.find((u) => u._id === id);
      setTempPasswordNotice({
        name: target ? `${target.firstName} ${target.lastName}` : id,
        password: result.tempPassword,
      });
    }
  };

  const handlePermissionsSubmit = async (id: string, permissions: string[]) => {
    await updateUserPermissions(id, permissions);
    await refresh();

    if (currentUserId && currentUserId === id) {
      try {
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Failed to refresh session after self permission update:", err);
      }
    }
  };

  const confirmDelete = async () => {
    try {
      await handleToggleArchive(deleteConfirm.id, false);
      setDeleteConfirm(CLOSED_DELETE);
    } catch (err: any) {
      setDeleteConfirm(CLOSED_DELETE);
      setPageError(err?.message ?? "Failed to delete user.");
    }
  };

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((a) => {
      const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        a.userId.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.role.toLowerCase().includes(query) ||
        (a.role === "super_admin" && "super admin".includes(query));
      return matchesSearch && (roleFilter === "all" || a.role === roleFilter);
    });
  }, [users, search, roleFilter]);
  const sortedAccounts = useMemo(() => {
    return [...filteredAccounts].sort((first, second) => {
      let comparison: number;
      if (sortBy === "name") {
        comparison = `${first.firstName} ${first.lastName}`.localeCompare(
          `${second.firstName} ${second.lastName}`,
        );
      } else {
        const firstDate = Date.parse(first.createdAt ?? first.dateAdded ?? "");
        const secondDate = Date.parse(second.createdAt ?? second.dateAdded ?? "");
        comparison =
          (Number.isNaN(firstDate) ? 0 : firstDate) -
          (Number.isNaN(secondDate) ? 0 : secondDate);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredAccounts, sortBy, sortDirection]);
  const totalPages = Math.max(1, Math.ceil(sortedAccounts.length / ACCOUNTS_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedAccounts = sortedAccounts.slice(
    (safeCurrentPage - 1) * ACCOUNTS_PAGE_SIZE,
    safeCurrentPage * ACCOUNTS_PAGE_SIZE,
  );

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6] text-[#1a1a1a] dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 overflow-x-hidden transition-colors duration-300">
        <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6">
          {/* Page header */}
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2942] dark:text-slate-50">
              Manage Accounts
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">
              Add, edit, and manage user accounts
            </p>
          </header>

          {/* Page-level error */}
          {pageError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="flex-1">{pageError}</p>
              <button
                type="button"
                onClick={() => setPageError(null)}
                aria-label="Dismiss"
                className="shrink-0 -m-1 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {tempPasswordNotice && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p>
                  The reset email for{" "}
                  <span className="font-semibold">{tempPasswordNotice.name}</span> failed to send.
                  Relay this temporary password securely:
                </p>
                <p className="mt-2 font-mono text-base font-semibold select-all">
                  {tempPasswordNotice.password}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTempPasswordNotice(null)}
                aria-label="Dismiss"
                className="shrink-0 -m-1 p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <AccountStatsSection accounts={users} />

          {/* Accounts card */}
          <section className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700 dark:shadow-none transition-colors duration-300">
            <AccountsFilterSection
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              onAddNewUser={() => setIsAddModalOpen(true)}
              roleFilter={roleFilter}
              onRoleFilterChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}
              sortBy={sortBy}
              onSortByChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
              sortDirection={sortDirection}
              onSortDirectionChange={(value) => {
                setSortDirection(value);
                setCurrentPage(1);
              }}
            />

            <AccountsListSection
              accounts={paginatedAccounts}
              totalAccounts={sortedAccounts.length}
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEditClick={(account) => setSelectedUserForEdit(account)}
              onPermissionsClick={
                canManagePermissions
                  ? (account) => setSelectedUserForPermissions(account)
                  : undefined
              }
              onDeleteClick={(id: string, name: string) =>
                setDeleteConfirm({ isOpen: true, id, name })
              }
            />
          </section>
        </div>

        {/* Modals */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
        />

        <EditUserModal
          isOpen={!!selectedUserForEdit}
          user={selectedUserForEdit}
          onClose={() => setSelectedUserForEdit(null)}
          onSubmit={handleEditSubmit}
          onResetPassword={handleResetPassword}
        />

        {/* NEW: permissions modal */}
        <PermissionsModal
          isOpen={!!selectedUserForPermissions}
          user={selectedUserForPermissions}
          onClose={() => setSelectedUserForPermissions(null)}
          onSubmit={handlePermissionsSubmit}
        />

        <DeleteConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm(CLOSED_DELETE)}
          onConfirm={confirmDelete}
          itemName={deleteConfirm.name || "Selected Account"}
          itemType="User Account"
        />
      </main>
    </div>
  );
};