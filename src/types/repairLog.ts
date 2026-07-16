export interface RepairLog {
    _id: string;
    asset: string;
    cost: number;
    description?: string | null;
    repairDate: string;
    loggedBy: string;
    createdAt: string;
    updatedAt: string;
}

export type NewRepairLog = {
    assetId: string; 
    description?: string;
    repairDate: string;
};