import type { UserAccount, NewUserForm, UpdateUserForm } from "../types/manageAccount";
import { apiRequest } from "./authService";

// GET all users
export const getAllUsers = async (): Promise<UserAccount[]> => {
  const res = await apiRequest('/users', { method: 'GET' });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Could not load users');
  }
  return await res.json();
};

// POST Create user
export const createUser = async (userData: Omit<NewUserForm, "password">): Promise<void> => {
  const res = await apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create user');
  }
};

// PUT Update user profile details
export const updateUser = async (userId: string, userData: UpdateUserForm): Promise<void> => {
  const res = await apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
};

// POST Archive user 
export const archiveUser = async (id: string): Promise<void> => {
  const res = await apiRequest(`/users/${id}/archive`, { method: 'POST' });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to archive user');
  }
};

// POST Trigger password reset for a user
export const resetUserPassword = async (userId: string): Promise<void> => {
  const res = await apiRequest(`/users/${userId}/reset-password`, {
    method: 'POST',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to reset password');
  }
};