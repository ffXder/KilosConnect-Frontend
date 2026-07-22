import { useState, useEffect, useCallback } from "react";
import { 
    getAllAssets, 
    getAssetForScan, 
    createAsset, 
    updateAsset, 
    updateAssetCondition, 
    archiveAsset, 
    unarchiveAsset 
} from "../services/assetService";
import type { Asset, NewAsset, UpdateAsset } from "../types/asset";

export function useAssets() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllAssets();
            
            if (Array.isArray(data)) {
                setAssets(data);
            } else if (data && typeof data === "object" && Array.isArray((data as any).assets)) {
                setAssets((data as any).assets);
            } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
                setAssets((data as any).data);
            } else {
                setAssets([]);
            }

            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAssets(); }, [fetchAssets]);

    const handleCreate = async (data: NewAsset) => {
        try { 
            await createAsset(data); 
            await fetchAssets();
        }
        catch (err: any) { 
            setError(err.message); 
        }
    };

    const handleUpdate = async (id: string, data: UpdateAsset) => {
        try { 
            await updateAsset(id, data); 
            await fetchAssets();
        }
        catch (err: any) { 
            setError(err.message);
        }
    };

    const handleUpdateCondition = async (id: string, condition: string, description: string) => {
        try { 
            await updateAssetCondition(id, condition, description); 
            await fetchAssets(); 
        } catch (err: any) { 
            setError(err.message); 
        }
    };

    const handleArchive = async (id: string) => {
        try { 
            await archiveAsset(id); 
            await fetchAssets(); 
        } catch (err: any) {
            setError(err.message); 
        }
    };

    const handleUnarchive = async (id: string) => {
        try {
            await unarchiveAsset(id);
            await fetchAssets();
        } catch (err: any) {
            setError(err.message);
        }
    }
    const handleScan = async (assetId: string) => {
        try {
            const asset = await getAssetForScan(assetId);
            return asset;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return { assets, loading, error, refresh: fetchAssets, handleCreate, handleUpdate, handleUpdateCondition, handleArchive, handleScan };
}