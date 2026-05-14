export interface Asset {
    _id: string;
    assetId: string;
    name: string;
    condition: "Good Condition" | "Needs Repair" | "Needs Replacement" | "Under Repair";
    purchaseDate: string;
    quantity: number;
    area: string;
    description?: string;
    isArchived: boolean;
    archivedAt: string | null;
    archivedBy: string | null;
}

//create
export type NewAsset = Omit<Asset, '_id' | 'assetId' | 'isArchived' | 'archivedAt' | 'archivedBy'>;

//update
export type UpdateAsset = Partial<Omit<Asset, '_id' | 'assetId' | 'isArchived' | 'archivedAt' | 'archivedBy'>>;