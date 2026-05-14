import type { Asset, NewAsset, UpdateAsset } from "../types/asset";
import { apiRequest } from "./authService";

//GET
export const getAllAssets = async (): Promise<Asset[]> => {
    const res = await apiRequest('/assets', { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
}

//POST
export const createAsset = async(data: NewAsset): Promise<Asset> => {
    const res = await apiRequest('/assets', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
}

//PUT
export const updateAsset = async(id: string, data: UpdateAsset): Promise<Asset> => {
    const res = await apiRequest(`/asset/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
}

//PATCH 
export const updateAssetCondition = async (id: string, condition: string, description: string): Promise<void> => {
    const res = await apiRequest(`/assets/${id}/condition`, {
        method: 'PATCH',
        body: JSON.stringify({ condition, description }),
    });
    if (!res.ok) { 
        const err = await res.json(); throw new Error(err.message);
    }
};

export const archiveAsset = async(id: string): Promise<void> => {
    const res = await apiRequest(`/assets/${id}/archive`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
}

export const unarchiveAsset = async(id: string): Promise<void> => {
    const res = await apiRequest(`/assets/${id}/unarchive`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
}

export const getArchivedAssets = async (): Promise<Asset[]> => {
    const res = await apiRequest('/assets/archived', { method: 'GET' });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load archived users');
    }
    return await res.json();
};

