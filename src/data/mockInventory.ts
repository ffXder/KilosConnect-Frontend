import type { InventoryItemData, EquipmentAsset } from "../types/inventory";
 
export const MOCK_CONSUMABLES: InventoryItemData[] = [
  { _id: "c1", consumableId: "CON-OGRNGQ0VQ", name: "Surf 1000000g", category: "Consumables", lowStockAlert: 2, quantity: 5, unit: "PACK", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c2", consumableId: "CON-2EV1HWZEW", name: "Detergent Liquid", category: "Consumables", lowStockAlert: 5, quantity: 2, unit: "BOX", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c3", consumableId: "CON-LMVQX3CV5", name: "ZESTO Juice", category: "Consumables", lowStockAlert: 2, quantity: 0, unit: "BOXES", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c4", consumableId: "CON-16QETGCLE", name: "Paper Towels", category: "Consumables", lowStockAlert: 10, quantity: 8, unit: "PCS", location: "Maintenance Supplies", type: "Consumable" },
  { _id: "c5", consumableId: "CON-99QETGAAA", name: "Hand Soap", category: "Consumables", lowStockAlert: 5, quantity: 5, unit: "BOTTLES", location: "Restrooms", type: "Consumable" },
];
 
export const MOCK_ASSETS: EquipmentAsset[] = [
  { _id: "a1", assetId: "AST-67P6CX88A", name: "Olympic Barbell", condition: "Working", area: "Open WOD Area", purchaseDate: new Date().toISOString(), type: "Asset" },
  { _id: "a2", assetId: "AST-2Q42RDE4L", name: "Rowing Machine", condition: "Working", area: "Powerlifting Area", purchaseDate: new Date().toISOString(), type: "Asset" },
  { _id: "a3", assetId: "AST-MUGFO4P4S", name: "Dumbbell Set 25kg", condition: "Need Repair", area: "Powerlifting Area", purchaseDate: new Date().toISOString(), type: "Asset" },
  { _id: "a4", assetId: "AST-H80OZQ6KB", name: "Treadmill X1", condition: "Under Repair", area: "Open WOD Area", purchaseDate: new Date().toISOString(), type: "Asset" },
];