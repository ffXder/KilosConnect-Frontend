import React, { useMemo } from "react";

interface Props {
  activeCategory: "All" | "Consumables" | "Assets";
  searchQuery: string;
  filter: string;
  selectedArea: string;
  selectedAssetArea: string;
  selectedCondition: string;
  mockConsumables: any[];
  mockAssets: any[];
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
  activeCategory,
  searchQuery,
  filter,
  selectedArea,
  selectedAssetArea,
  selectedCondition,
  mockConsumables,
  mockAssets,
  children,
}) => {
  const isLowStock = (item: any) => item.quantity <= item.lowStockAlert && item.quantity > 0;
  const isOutOfStock = (item: any) => item.quantity === 0;

  const filteredConsumables = useMemo(() => {
    return mockConsumables.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = activeCategory === "Consumables" ? item.area === selectedArea : true;

      let matchesStatus = true;
      if (filter === "LOW STOCK") matchesStatus = isLowStock(item);
      if (filter === "OUT OF STOCK") matchesStatus = isOutOfStock(item);

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [searchQuery, filter, selectedArea, activeCategory, mockConsumables]);

  const filteredAssets = useMemo(() => {
    return mockAssets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = selectedAssetArea === "ALL AREAS" || asset.area === selectedAssetArea;
      const matchesCondition = selectedCondition === "ALL CONDITIONS" || asset.condition.toUpperCase() === selectedCondition;

      return matchesSearch && matchesArea && matchesCondition;
    });
  }, [searchQuery, selectedAssetArea, selectedCondition, mockAssets]);

  const outOfStockCount = mockConsumables.filter(isOutOfStock).length;
  const lowStockCount = mockConsumables.filter(isLowStock).length;

  // New Dynamic Calculations for Assets
  const goodConditionCount = mockAssets.filter(a => a.condition === "Good Condition").length;
  const needRepairCount = mockAssets.filter(a => a.condition === "Need Repair").length;
  const needsReplacementCount = mockAssets.filter(a => a.condition === "Needs Replacement").length;
  const underRepairCount = mockAssets.filter(a => a.condition === "Under Repair").length;

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