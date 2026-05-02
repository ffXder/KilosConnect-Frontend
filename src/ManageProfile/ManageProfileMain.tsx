import React, { useMemo, useState } from "react";
import SidebarManageProfile from "../components/SidebarManageProfile";

interface UserAccount {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  dateAdded: string;
}

interface NewUserForm {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  role: string;
  dateJoined: string;
  avatarUrl?: string;
}

export interface PerformanceStats {
  tasksCompleted: number;
  incidentsReported: number;
  itemsLogged: number;
  activeDays: number;
}

export type ActivityType = "task" | "incident" | "inventory" | "log";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timeAgo: string;
}

const ManageProfileMain: React.FC = () => {
  const [search, setSearch] = useState("");
  const [accounts] = useState<UserAccount[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          account.name.toLowerCase().includes(search.toLowerCase()) ||
          account.email.toLowerCase().includes(search.toLowerCase())
      ),
    [accounts, search]
  );

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewUserForm({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "",
    });
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUserForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    closeAddModal();
    // TODO: connect this to backend/database to add a user.
  };

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      <SidebarManageProfile />

      <div className="flex flex-col flex-1 min-w-0 ml-60 overflow-y-auto">
        <header className="flex items-center justify-between px-8 pt-8 pb-4 bg-white border-b border-[#e8e8e8]">
          <div>
            <h1 className="font-['Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[36px] leading-tight m-0 p-0">
              Manage Accounts
            </h1>
            <p className="mt-0.5 font-['Poppins',Helvetica] font-normal text-[#6b6b6b] text-base leading-normal m-0 p-0">
              Add, edit, and manage user accounts
            </p>
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

        <main className="flex-1 p-6 min-h-0">
          <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-[#eef1f3]">
              <div>
                <p className="font-['Poppins',Helvetica] font-semibold text-[#1a1a1a] text-xl m-0 p-0">
                  User Accounts
                </p>
                <p className="font-['Poppins',Helvetica] text-sm text-[#6b6b6b] mt-1 m-0 p-0">
                  Manage accounts and update access levels for your team.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-[#072821] hover:bg-[#153d34] text-white text-sm font-medium px-4 py-2 rounded-[10px] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New User
              </button>
            </div>

            <div className="px-6 py-5 border-b border-[#eef1f3]">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full rounded-xl border border-[#d1d5db] bg-[#fafbfc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-[#fafbfc]">
                  <tr>
                    {[
                      "Name",
                      "User ID",
                      "Role",
                      "Status",
                      "Date Added",
                      "Actions",
                    ].map((label) => (
                      <th
                        key={label}
                        className="px-6 py-4 text-left text-[11px] font-semibold tracking-[0.18em] uppercase text-[#6b7280]"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-sm text-[#9ca3af]"
                      >
                        No user accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr
                        key={account.id}
                        className="border-b border-[#eef1f3] hover:bg-[#fbfcfd] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1a4d3e] text-white flex items-center justify-center text-sm font-semibold">
                              {account.initials}
                            </div>
                            <div>
                              <p className="font-['Poppins',Helvetica] font-medium text-sm text-[#1a1a1a] m-0">
                                {account.name}
                              </p>
                              <p className="font-['Poppins',Helvetica] text-xs text-[#6b7280] m-0">
                                {account.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-['Poppins',Helvetica] text-sm text-[#6b7280]">
                          {account.email}
                        </td>
                        <td className="px-6 py-4 font-['Poppins',Helvetica] text-sm text-[#1a1a1a]">
                          <span className="inline-flex items-center rounded-full bg-[#eef6f1] px-3 py-1 text-xs font-semibold text-[#1a4d3e]">
                            {account.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              account.status === "Active"
                                ? "bg-[#def7ec] text-[#166534]"
                                : "bg-[#f3f4f6] text-[#6b7280]"
                            }`}
                          >
                            {account.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-['Poppins',Helvetica] text-sm text-[#6b7280]">
                          {account.dateAdded}
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <button
                            type="button"
                            className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-[#ef4444] hover:text-[#dc2626] transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
              <div className="rounded-t-2xl bg-[#072821] px-6 py-4">
                <h2 className="font-['Poppins',Helvetica] text-lg font-semibold text-white">
                  Add User
                </h2>
              </div>
              <form onSubmit={handleAddUserSubmit} className="space-y-4 px-6 py-6">
                {[
                  { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
                  { name: "password", label: "Password", type: "password", placeholder: "Enter password" },
                  { name: "firstName", label: "First Name", type: "text", placeholder: "Enter first name" },
                  { name: "lastName", label: "Last Name", type: "text", placeholder: "Enter last name" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      {field.label}
                      <span className="text-[#ef4444]"> *</span>
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={newUserForm[field.name as keyof NewUserForm]}
                      onChange={handleNewUserChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-[10px] border border-[#d1d5db] bg-[#f8fafb] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Role<span className="text-[#ef4444]"> *</span>
                  </label>
                  <select
                    name="role"
                    value={newUserForm.role}
                    onChange={handleNewUserChange}
                    className="w-full rounded-[10px] border border-[#d1d5db] bg-[#f8fafb] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
                  >
                    <option value="">Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="Custodian">Custodian</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f3f4f6] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[10px] bg-[#072821] px-4 py-2 text-sm font-medium text-white hover:bg-[#153d34] transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProfileMain;