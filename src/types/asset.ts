export interface Asset {
    _id: string;
    assetId: string;
    name: string;
    condition: string;
    purchaseDate: string;
    quantity: number;
    area: string;
    description?: string;
    isArchived: boolean;
}

//create
export type NewAsset = Omit<Asset, '_id' | 'isArchived'>;

//update
export type UpdateAsset = Partial<Omit<Asset, '_id' | 'assetId'>>;