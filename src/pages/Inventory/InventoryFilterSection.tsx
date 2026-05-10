import React, { useMemo } from "react";

interface Props {
  activeInventory: "All" | "Consumables" | "Assets";
  searchQuery: string;
  filter: string;
  selectedArea: string;
  selectedAssetArea: string;
  selectedCondition: string;
  getConsumables: any[];
  getAssets: any[];
  children: (data: {
    filteredConsumables: any[];
    filteredAssets: any[];
    outOfStockCount: number;
    lowStockCount: number;
    goodConditionCount: number;
    needRepairCount: number;
    needsReplacementCount: number;
    underRepairCount: number;
    isLowStock: (item: any) => boolean;
    isOutOfStock: (item: any) => boolean;
  }) => React.ReactNode;
}

export const InventoryFilterSection: React.FC<Props> = ({
  activeInventory,
  searchQuery,
  filter,
  selectedArea,
  selectedAssetArea,
  selectedCondition,
  getConsumables,
  getAssets,
  children,
}) => {
  const isLowStock = (item: any) => item.quantity <= item.lowStockAlert && item.quantity > 0;
  const isOutOfStock = (item: any) => item.quantity === 0;

  const filteredConsumables = useMemo(() => {
    return getConsumables.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = activeInventory === "Consumables" ? (selectedArea === "All Areas" || item.location === selectedArea) : true;

      let matchesStatus = true;
      if (filter === "LOW STOCK") matchesStatus = isLowStock(item);
      if (filter === "OUT OF STOCK") matchesStatus = isOutOfStock(item);

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [searchQuery, filter, selectedArea, activeInventory, getConsumables]);

  const filteredAssets = useMemo(() => {
    return getAssets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = selectedAssetArea === "All Areas" || asset.area === selectedAssetArea;
      const matchesCondition = selectedCondition === "All Conditions" || asset.condition === selectedCondition;

      return matchesSearch && matchesArea && matchesCondition;
    });
  }, [searchQuery, selectedAssetArea, selectedCondition, getAssets]);

  const outOfStockCount = getConsumables.filter(isOutOfStock).length;
  const lowStockCount = getConsumables.filter(isLowStock).length;

  // New Dynamic Calculations for Assets
  const goodConditionCount = getAssets.filter(a => a.condition === "Good Condition").length;
  const needRepairCount = getAssets.filter(a => a.condition === "Needs Repair").length;
  const needsReplacementCount = getAssets.filter(a => a.condition === "Needs Replacement").length;
  const underRepairCount = getAssets.filter(a => a.condition === "Under Repair").length;

  return (
    <>
      {children({
        filteredConsumables,
        filteredAssets,
        outOfStockCount,
        lowStockCount,
        goodConditionCount,
        needRepairCount,
        needsReplacementCount,
        underRepairCount,
        isLowStock,
        isOutOfStock,
      })}
    </>
  );
};