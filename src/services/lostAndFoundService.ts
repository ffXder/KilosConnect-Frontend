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
export const createLostAndFound = async (data: NewLostAndFound, imageFile: File): Promise<LostAndFound> => {
    const formData = new FormData();
    formData.append('item', data.item);
    formData.append('areaFound', data.areaFound);
    formData.append('date', data.date);
    formData.append('itemImage', imageFile);
    if (data.description) formData.append('description', data.description);

    const res = await apiRequest('/lost-and-founds', {
        method: 'POST',
        body: formData,
        
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not create item');
    }
    return res.json();
};

// UPDATE
export const updateLostAndFound = async (id: string, data: UpdateLostAndFound, imageFile?: File): Promise<LostAndFound> => {
    let res;

    if (imageFile) {
        // use FormData if there's a new image
        const formData = new FormData();
        if (data.item) formData.append('item', data.item);
        if (data.description) formData.append('description', data.description);
        if (data.areaFound) formData.append('areaFound', data.areaFound);
        if (data.date) formData.append('date', data.date);
        if (data.status) formData.append('status', data.status);
        formData.append('itemImage', imageFile);

        res = await apiRequest(`/lost-and-founds/${id}`, {
            method: 'PUT',
            body: formData,
        });
    } else {
        // no image, use JSON
        res = await apiRequest(`/lost-and-founds/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not update item');
    }
    return res.json();
};

// CLAIM
export const claimLostAndFound = async (id: string, claimedBy: string, imageFile: File): Promise<void> => {
    const formData = new FormData();
    formData.append('claimedBy', claimedBy);
    formData.append('claimedImage', imageFile); // file object

    const res = await apiRequest(`/lost-and-founds/${id}/claim`, {
        method: 'PATCH',
        body: formData,
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

// PATCH
export const archiveLostAndFound = async (id: string): Promise<void> => {
    const res = await apiRequest(`/lost-and-founds/${id}/archive`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not archive item');
    }
};

export const unarchiveLostAndFound = async (id: string): Promise<void> => {
    const res = await apiRequest(`/lost-and-founds/${id}/unarchive`, { method: 'PATCH'});
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to unarchive item');
    }
}

//GET ARCHIVED
export const getArchivedItems = async (): Promise<LostAndFound[]> => {
    const res = await apiRequest('/lost-and-founds/archived', { method: 'GET' });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load archived items');
    }
    return await res.json();
};