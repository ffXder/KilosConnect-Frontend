export interface Asset {
    _id: string;
    assetId: string;
    qrCode: string;
    name: string;
    category: string;
    condition: "Working" | "Needs Repair" | "Under Repair" | "Needs Replacement" | "Hazardous" | "Decommissioned";
    purchaseDate: string;
    srp: number;
    cumulativeRepairCost: number;
    area: string;
    baselineImageUrl?: string | null;
    description?: string;
    isArchived: boolean;
    archivedAt: string | null;
    archivedBy: string | null;
    recommendation?: 'Replace Immediately' | 'Monitor Closely' | 'Healthy' | 'Unknown SRP, cannot determine replacement recommendation';
}

//create
export type NewAsset = Omit<Asset, '_id' | 'assetId' | 'qrCode' | 'cumulativeRepairCost' | 'isArchived' | 'archivedAt' | 'archivedBy' | 'recommendation'>;

//update
export type UpdateAsset = Partial<Omit<Asset, '_id' | 'assetId' | 'qrCode' | 'isArchived' | 'archivedAt' | 'archivedBy' | 'recommendation'>>;