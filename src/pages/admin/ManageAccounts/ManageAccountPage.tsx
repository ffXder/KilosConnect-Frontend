import React, { useState } from "react";
import { useAuth } from '../../../hooks/useAuth';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import type { UserAccount, NewUserForm } from "../../../types/manageAccount";
import { AccountsFilterSection } from "./components/AccountFilterSection";
import AccountsListSection from "./components/AccountListSection";
import { createUser, updateUser } from "../../../services/manageAccountService";
import { useUsers } from "../../../hooks/useUsers";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal";
import { AddUserModal } from "./components/AddUserModal";
import { EditUserModal } from "./components/EditUserModal";

export const ManageAccountsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { users, refresh, handleToggleArchive } = useUsers();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string}>({
    isOpen: false, id: "", name: ""
  });

  const handleAddSubmit = async (data: Omit<NewUserForm, "password">) => {
    await createUser(data as NewUserForm);
    await refresh();
  };

  const handleEditSubmit = async (userId: string, data: Partial<NewUserForm>) => {
    await updateUser(userId, data);
    await refresh();
  };

  const handleResetPassword = async (userId: string) => {
    console.log("Resetting password for user:", userId);
  };

  const confirmDelete = async () => {
    try {
      await handleToggleArchive(deleteConfirm.id, false);
      setDeleteConfirm({ isOpen: false, id: "", name: "" });
    } catch (err: any) {
      alert("Failed to delete user.");
    }
  };

  const filteredAccounts = users.filter(a => {
    const query = search.toLowerCase();
    const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
    return (
      fullName.includes(query) || 
      a.userId.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query)
    );
  });

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6] text-[#1a1a1a] dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 w-full p-4 md:p-8 space-y-6 overflow-x-hidden dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto space-y-6">
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

          <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
            <AccountsFilterSection 
              totalAccounts={filteredAccounts.length}
              onSearchChange={setSearch}
              onAddNewUser={() => setIsAddModalOpen(true)}
            />

            <AccountsListSection 
              accounts={filteredAccounts} 
              onEditClick={(account) => setSelectedUserForEdit(account)}
              onDeleteClick={(id: string, name: string) => setDeleteConfirm({ isOpen: true, id, name })} 
            />
          </div>
        </div>

        {/* --- ADD USER MODAL --- */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
        />

        {/* --- EDIT USER MODAL --- */}
        <EditUserModal
          isOpen={!!selectedUserForEdit}
          user={selectedUserForEdit}
          onClose={() => setSelectedUserForEdit(null)}
          onSubmit={handleEditSubmit}
          onResetPassword={handleResetPassword}
        />

        {/* --- DELETE CONFIRM MODAL --- */}
        <DeleteConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })}
          onConfirm={confirmDelete}
          itemName={deleteConfirm.name || "Selected Account"}
          itemType="User Account"
        />
      </main>
    </div>
  );
};