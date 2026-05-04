import type { InventoryItemData, EquipmentAsset } from "../types/inventory";

const API_URL = '/api'

const apiFetch = async (url: string, options?: RequestInit) => {

    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type" : "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    credentials: "include",
});

if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${res.status}`)
}
    return res.json();
};

export const inventoryService  = {
    getSummary: (): Promise<{ consumables: InventoryItemData[]; assets: EquipmentAsset[] }> =>
    apiFetch(`${API_URL}/inventory/summary`)
};

export const consumableService = {
    //GET
    getAll: (): Promise<InventoryItemData[]> =>
        apiFetch(`${API_URL}/consumables`),

    getById: (consumableId: string): Promise<InventoryItemData> =>
        apiFetch(`${API_URL}/consumables/${consumableId}`),

    getArchived: (): Promise<InventoryItemData[]> =>
        apiFetch(`${API_URL}/consumables/archived`),

    //POST
    create: (data: Partial<InventoryItemData>): Promise<InventoryItemData> =>
        apiFetch(`${API_URL}/consumables`, {
          method: 'POST',
          body: JSON.stringify(data),
        }),
    
    //PUT
    update: (consumableId: string, data: Partial<InventoryItemData>): Promise<InventoryItemData> =>
        apiFetch(`${API_URL}/consumables/${consumableId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        }),
    
    //PATCH
    archive: (consumableId: string): Promise<void> =>
        apiFetch(`${API_URL}/consuambles/${consumableId}/archive`, {
          method: 'PATCH'
        }),

    unarchive: (consumableId: string): Promise<void> =>
        apiFetch(`${API_URL}/consumables/${consumableId}/unarchive`, {
          method: "PATCH",
        }),    
};

export const assetService = {
    //GET
    getAll: (): Promise<EquipmentAsset[]> =>
        apiFetch(`${API_URL}/assets`),

    getbyId: (assetId: string): Promise<EquipmentAsset[]> =>
        apiFetch(`${API_URL}/assets/${assetId}`),

    getArchived: (): Promise<EquipmentAsset[]> =>
        apiFetch(`${API_URL}/assets/archived`),

    //POST
    create: (data: Partial<EquipmentAsset>) =>
        apiFetch(`${API_URL}/assets`, {
          method: 'POST',
          body: JSON.stringify(data)
        }),
    
    //PUT
    update: (assetId: string, data: Partial<EquipmentAsset[]>) =>
        apiFetch(`${API_URL}/assets/${assetId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        }),

    //PATCH
    archive: (assetId: string): Promise<void> =>
        apiFetch(`${API_URL}/assets/${assetId}/archive`, {
            method: 'PATCH'
        }),
    
    unarchive: (assetId: string): Promise<void> =>
    apiFetch(`${API_URL}/assets/${assetId}/unarchive`, {
      method: "PATCH",
    }),
}