import type { LostAndFound, NewLostAndFound, UpdateLostAndFound } from "../types/lostAndFound";
import { apiRequest } from "./authService";

// GET ALL
export const getAllLostAndFound = async (): Promise<LostAndFound[]> => {
    const res = await apiRequest('/lost-and-founds', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load lost and found items');
    }
    return res.json();
};

// CREATE
export const createLostAndFound = async (data: NewLostAndFound): Promise<LostAndFound> => {
    const res = await apiRequest('/lost-and-founds', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not create item');
    }
    return res.json();
};

// UPDATE
export const updateLostAndFound = async (id: string, data: UpdateLostAndFound): Promise<LostAndFound> => {
    const res = await apiRequest(`/lost-and-founds/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not update item');
    }
    return res.json();
};

// CLAIM
export const claimLostAndFound = async (id: string, claimedBy: string): Promise<void> => {
    const res = await apiRequest(`/lost-and-founds/${id}/claim`, {
        method: 'PATCH',
        body: JSON.stringify({ claimedBy }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not claim item');
    }
};

// UNCLAIM
export const unclaimLostAndFound = async (id: string): Promise<void> => {
    const res = await apiRequest(`/lost-and-founds/${id}/unclaim`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not unclaim item');
    }
};

// DELETE
export const deleteLostAndFound = async (id: string): Promise<void> => {
    const res = await apiRequest(`/lost-and-founds/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not delete item');
    }
};