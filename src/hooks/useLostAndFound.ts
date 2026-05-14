import { useState, useEffect, useCallback } from 'react';
import type { LostAndFound, NewLostAndFound, UpdateLostAndFound } from '../types/lostAndFound';
import {
    getAllLostAndFound,
    createLostAndFound,
    updateLostAndFound,
    claimLostAndFound,
    unclaimLostAndFound,
    archiveLostAndFound
} from '../services/lostAndFoundService';

export function useLostAndFound() {
    const [items, setItems] = useState<LostAndFound[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllLostAndFound();
            setItems(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleCreate = async (data: NewLostAndFound, imageFile: File) => {
        try {
            await createLostAndFound(data, imageFile);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdate = async (id: string, data: UpdateLostAndFound, imageFile?: File) => {
        try {
            await updateLostAndFound(id, data, imageFile);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleClaim = async (id: string, claimedBy: string, imageFile: File) => {
        try {
            await claimLostAndFound(id, claimedBy, imageFile);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUnclaim = async (id: string) => {
        try {
            await unclaimLostAndFound(id);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await archiveLostAndFound(id);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { 
        items, 
        loading, 
        error, 
        refresh: fetchItems,
        handleCreate, 
        handleUpdate, 
        handleClaim,
        handleUnclaim,
        handleDelete 
    };
}