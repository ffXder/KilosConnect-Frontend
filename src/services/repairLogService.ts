import type { RepairLog, NewRepairLog } from "../types/repairLog";
import type { Asset } from "../types/asset";
import { apiRequest } from "./authService";

// POST
export const createRepairLog = async (data: NewRepairLog): Promise<{ repair: RepairLog; updatedAsset: Asset }> => {
    const res = await apiRequest('/repair-logs', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
};

// GET
export const getRepairLogsByAsset = async (assetMongoId: string): Promise<RepairLog[]> => {
    const res = await apiRequest(`/repair-logs/asset/${assetMongoId}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return res.json();
};