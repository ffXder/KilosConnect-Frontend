import { useState, useEffect, useCallback } from 'react';
import type { Consumable, NewConsumable, UpdateConsumable } from '../types/consumable';
import { getAllConsumables, createConsumable, updateConsumable, archiveConsumable } from '../services/consumableService';

export function useConsumables() {
    const [consumables, setConsumables] = useState<Consumable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConsumables = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllConsumables();
            setConsumables(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchConsumables(); }, [fetchConsumables]);

    const handleCreate = async (data: NewConsumable) => {
        try { 
            await createConsumable(data);
            await fetchConsumables();
        } catch (err: any) { 
            setError(err.message);
        }
    };

    const handleUpdate = async (id: string, data: UpdateConsumable) => {
        try { 
            await updateConsumable(id, data); 
            await fetchConsumables(); 
        } catch (err: any) { 
            setError(err.message);
        }
    };

    const handleArchive = async (id: string) => {
        try { 
            await archiveConsumable(id); 
            await fetchConsumables();
        } catch (err: any) { 
            setError(err.message);
        }
    };

    return { consumables, loading, error, refresh: fetchConsumables, handleCreate, handleUpdate, handleArchive };
}