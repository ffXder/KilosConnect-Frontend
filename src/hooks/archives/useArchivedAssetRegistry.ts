import { useState, useEffect, useCallback } from 'react';
import { getArchivedAssets, unarchiveAsset } from '../../services/assetService';
import type { Asset } from '../../types/asset';

export type ArchivedInventoryItem =
  | (Asset & { kind: 'asset' })

export function useArchivedAssetRegistry() {
  const [archivedAssets, setArchivedAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [assets] = await Promise.all([
        getArchivedAssets(),
      ]);
      setArchivedAssets(assets);
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

  return {
    archivedAssets,
    loading,
    error,
    refresh: fetchAll,
    handleUnarchiveAsset,
  };
}