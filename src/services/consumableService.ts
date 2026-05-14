import type { Consumable, NewConsumable, UpdateConsumable } from "../types/consumable";
import { apiRequest } from "./authService";

//GET
export const getAllConsumables = async(): Promise<Consumable[]> => {
    const res = await apiRequest('/consumables', { method: 'GET'});
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
    }
    return res.json();
}

//POST 
export const createConsumable = async(data: NewConsumable): Promise<Consumable> => {
    const res = await apiRequest('/consumables', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
    }
    return res.json();
}

//PUT
export const updateConsumable = async(id: string, data: UpdateConsumable): Promise<Consumable> => {
    const res = await apiRequest(`/consumables/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
    }
    return res.json();
}

export const archiveConsumable = async(id: string): Promise<void> => {
    const res = await apiRequest(`/consumables/${id}/archive`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
    }
    return res.json();
}

export const unarchiveConsumable = async(id: string): Promise<void> => {
    const res = await apiRequest(`/consumables/${id}/unarchive`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Could not unarchive consumable')
    }
    return res.json();
}

export const getArchivedConsumables = async (): Promise<Consumable[]> => {
    const res = await apiRequest('/consumables/archived', { method: 'GET' });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load archived users');
    }
    return await res.json();
};
