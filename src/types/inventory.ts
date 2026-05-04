export interface InventoryItemData {
  _id: string;
  consumableId: string;
  name: string;
  category: string;
  lowStockAlert: number;
  quantity: number;
  unit: string;
  location: string;
  type: "Consumable";
}
 
export interface EquipmentAsset {
  _id: string;
  assetId: string;
  name: string;
  condition: "Working" | "Damaged" | "Need Repair" | "Under Repair";
  area: string;
  purchaseDate: string;
  type: "Asset";
}
 
export type ActiveCategory = "Consumables" | "Assets" | "All";
export type StockFilter = "ALL" | "LOW STOCK" | "OUT OF STOCK";