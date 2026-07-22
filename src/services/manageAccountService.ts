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

//PATCH
export const toggleArchiveUser = async (userId: string, isArchived: boolean): Promise<void> => {
  const res = await apiRequest(`/users/${userId}/archive`, {
    method: 'PATCH',
    body: JSON.stringify({ isArchived }) // Sending the new status
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
};

export const unarchiveUser = async (userId: string): Promise<void> => {
    const res = await apiRequest(`/users/${userId}/unarchive`, { method: 'PATCH'});
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to unarchive user');
    }
}

//GET Archive
export const getArchivedUsers = async (): Promise<UserAccount[]> => {
    const res = await apiRequest('/users/archived', { method: 'GET' });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load archived users');
    }
    return await res.json();
};