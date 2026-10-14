import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import type { UserAccount, NewUserForm } from "../../../types/manageAccount";
import { AccountsFilterSection } from "./components/AccountFilterSection";
import AccountsListSection from "./components/AccountListSection";
import { createUser, updateUser } from "../../../services/manageAccountService";
import { useUsers } from "../../../hooks/useUsers";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal";
import { AddUserModal } from "./components/AddUserModal";
import { EditUserModal } from "./components/EditUserModal";
import type {
  AccountRoleFilter,
  AccountSortDirection,
  AccountSortField,
} from "./components/AccountFilterSection";

const CLOSED_DELETE = { isOpen: false, id: "", name: "" };

export const ManageAccountsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AccountRoleFilter>("all");
  const [sortBy, setSortBy] = useState<AccountSortField>("name");
  const [sortDirection, setSortDirection] = useState<AccountSortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { users, loading, refresh, handleToggleArchive } = useUsers();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string }>(
    CLOSED_DELETE
  );
  const [pageError, setPageError] = useState<string | null>(null);

  const handleAddSubmit = async (data: Omit<NewUserForm, "password">) => {
    await createUser(data as NewUserForm);
    await refresh();
  };

  const handleEditSubmit = async (userId: string, data: Partial<NewUserForm>) => {
    await updateUser(userId, data);
    await refresh();
  };

  const handleResetPassword = async (userId: string) => {
    // TODO: call the backend (e.g. send a one-time reset link) before shipping
    console.log("Resetting password for user:", userId);
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

  const filteredAccounts = users.filter(a => {
    const query = search.toLowerCase();
    const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
    const matchesRole = roleFilter === "all" || a.role === roleFilter;
    const matchesSearch =
      fullName.includes(query) ||
      a.userId.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query);
    return (
      matchesRole && matchesSearch
    );
  });
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let comparison: number;
    if (sortBy === "name") {
      comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    } else {
      const firstDate = Date.parse(a.createdAt ?? a.dateAdded ?? "");
      const secondDate = Date.parse(b.createdAt ?? b.dateAdded ?? "");
      comparison = (Number.isNaN(firstDate) ? 0 : firstDate) - (Number.isNaN(secondDate) ? 0 : secondDate);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });
  const totalPages = Math.max(1, Math.ceil(sortedAccounts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedAccounts = sortedAccounts.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6] text-[#1a1a1a] dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 overflow-x-hidden dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0f2942] dark:text-slate-50">
                Manage Accounts
              </h1>
              <p className="text-gray-500 text-sm mt-1 dark:text-slate-300">
                Add, edit, and manage user accounts
              </p>
            </div>
          </div>

          {pageError && (
            <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle size={18} className="shrink-0" />
              <p className="flex-1">{pageError}</p>
              <button type="button" onClick={() => setPageError(null)} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          <section className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700 dark:shadow-none transition-colors duration-300">
            <AccountsFilterSection
              totalAccounts={sortedAccounts.length}
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
              loading={loading}
              onEditClick={(account) => setSelectedUserForEdit(account)}
              onDeleteClick={(id, name) =>
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
