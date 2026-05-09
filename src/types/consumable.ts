export interface Consumable {
    _id: string;
    consumableId: string;
    name: string;
    category: string;
    unit: string;
    quantity: number;
    lowStockAlert: number;
    location: string;
    description?: string;
    isArchived: boolean;
}

//for create
export type NewConsumable = Omit<Consumable, '_id' | 'isArchived'>;

//for update
export type UpdateConsumable = Partial<Omit<Consumable, '_id' | 'consumableId'>>;