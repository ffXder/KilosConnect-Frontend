import React from "react";
import type { InventoryItemData, EquipmentAsset, ActiveCategory } from "../../types/inventory";
import { ConsumableCard } from "./ConsumableCard";
import { AssetCard } from "./AssetCard";

interface Props {
  activeCategory: ActiveCategory;
  filteredConsumables: InventoryItemData[];
  filteredAssets: EquipmentAsset[];
  isLowStock: (item: InventoryItemData) => boolean;
  isOutOfStock: (item: InventoryItemData) => boolean;
  onDeleteConsumable: (id: string) => void;
  onDeleteAsset: (id: string) => void;
}

export const InventoryList: React.FC<Props> = ({
  activeCategory,
  filteredConsumables,
  filteredAssets,
  isLowStock,
  isOutOfStock,
  onDeleteConsumable,
  onDeleteAsset
}) => {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {(activeCategory === "Consumables" || activeCategory === "All") &&
        filteredConsumables.map((item) => (
          <ConsumableCard
            key={item._id}
            item={item}
            isLowStock={isLowStock(item)}
            isOutOfStock={isOutOfStock(item)}
            onDelete={onDeleteConsumable}
          />
        ))}

      {(activeCategory === "Assets" || activeCategory === "All") &&
        filteredAssets.map((asset) => (
          <AssetCard 
          key={asset._id} 
          asset={asset}
          onDelete={onDeleteAsset}
          />
        ))}
    </div>
  );
};