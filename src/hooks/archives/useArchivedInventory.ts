import { useState, useEffect, useCallback } from 'react';
import { getArchivedAssets, unarchiveAsset } from '../../services/assetService';
import { getArchivedConsumables, unarchiveConsumable } from '../../services/consumableService';
import type { Asset } from '../../types/asset';
import type { Consumable } from '../../types/consumable';

export type ArchivedInventoryItem =
  | (Asset & { kind: 'asset' })
  | (Consumable & { kind: 'consumable' });

export function useArchivedInventory() {
  const [archivedAssets, setArchivedAssets] = useState<Asset[]>([]);
  const [archivedConsumables, setArchivedConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [assets, consumables] = await Promise.all([
        getArchivedAssets(),
        getArchivedConsumables(),
      ]);
      setArchivedAssets(assets);
      setArchivedConsumables(consumables);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUnarchiveAsset = async (id: string) => {
    try {
      await unarchiveAsset(id);
      await fetchAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnarchiveConsumable = async (id: string) => {
    try {
      await unarchiveConsumable(id);
      await fetchAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    archivedAssets,
    archivedConsumables,
    loading,
    error,
    refresh: fetchAll,
    handleUnarchiveAsset,
    handleUnarchiveConsumable,
  };
}