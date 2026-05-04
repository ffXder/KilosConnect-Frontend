import { useState, useEffect } from "react";
import type { InventoryItemData, EquipmentAsset, ActiveCategory, StockFilter } from "../types/inventory";
import { inventoryService, consumableService, assetService } from "../services/inventoryService";

export const useInventory = () => {
    const [consumables, setConsumables] = useState<InventoryItemData[]>([]);
    const [assets, setAssets] = useState<EquipmentAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ActiveCategory>("Consumables");
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<StockFilter>("ALL");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [consumablesData, assetData] = await Promise.all([
                    consumableService.getAll(),
                    assetService.getAll(),
                ]);
                console.log('consumable fetched:', consumablesData.length)
                console.log('assets fetched:', assetData.length)
                setConsumables(consumablesData);
                setAssets(assetData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load inventory")
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // stock helperss
    const isLowStock = (item: InventoryItemData) =>
        item.quantity > 0 && item.quantity <= item.lowStockAlert;

    const isOutOfStock = (item: InventoryItemData) => item.quantity === 0;

    const outOfStockCount = consumables.filter(isOutOfStock).length;
    const lowStockCount = consumables.filter(isLowStock).length;

    // filter list
    const filteredConsumables = consumables.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === "LOW STOCK") return matchesSearch && isLowStock(item);
        if (filter === "OUT OF STOCK") return matchesSearch && isOutOfStock(item);

        return matchesSearch;
    });

    const filteredAssets = assets.filter((asset) => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //actions
    const deleteConsumable = async (id: string) => {
        try {
            await consumableService.archive(id);
            setConsumables((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
           setError(err instanceof Error ? err.message : "Failed to delete asset."); 
        }
    }

    const deleteAsset = async (id: string) => {
        try {
            await assetService.archive(id);
            setAssets((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete asset.");
        }
    };

    const addConsumable = async (data: Partial<InventoryItemData>) => {
        try {
            const newItem = await consumableService.create(data);
            setConsumables((prev) => [...prev, newItem]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add item.");
        }
    };
 
    const addAsset = async (data: Partial<EquipmentAsset>) => {
        try {
            const newAsset = await assetService.create(data);
            setAssets((prev) => [...prev, newAsset]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add asset.");
        }
    };

  return {
    consumables, assets,
    loading, error,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    filter, setFilter,
    isLowStock, isOutOfStock,
    outOfStockCount, lowStockCount,
    filteredConsumables, filteredAssets,
    deleteConsumable, deleteAsset,
    addConsumable, addAsset,
  };
};