import type { UserAccount, NewUserForm } from "../types/manageAccount";
import { apiRequest } from "./authService";


// GET all
export const getAllUsers = async (): Promise<UserAccount[]> => {
    const res = await apiRequest('/users', { method: 'GET'});

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load users');
    }
    return await res.json();;
};

//POST
export const createUser = async (userData: NewUserForm): Promise<void> => {
    const res = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create user');
  }
};

//PUT
export const updateUser = async (userId: string, userData: NewUserForm): Promise<void> => {
    const res = await apiRequest(`/users/${userId}` , {
        method: 'PUT',
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Update failed');
    }
};

//POST
export const archiveUser = async (id: string): Promise<void> => {
  const res = await apiRequest(`/users/${id}/archive`, { method: 'POST' });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
};