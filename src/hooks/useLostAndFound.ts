import { useState, useEffect, useCallback } from 'react';
import type { LostAndFound, NewLostAndFound, UpdateLostAndFound } from '../types/lostAndFound';
import {
    getAllLostAndFound,
    createLostAndFound,
    updateLostAndFound,
    claimLostAndFound,
    unclaimLostAndFound,
    deleteLostAndFound
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

    const handleCreate = async (data: NewLostAndFound) => {
        try {
            await createLostAndFound(data);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdate = async (id: string, data: UpdateLostAndFound) => {
        try {
            await updateLostAndFound(id, data);
            await fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleClaim = async (id: string, claimedBy: string) => {
        try {
            await claimLostAndFound(id, claimedBy);
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
            await deleteLostAndFound(id);
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