import { useState, useEffect, useCallback } from 'react';
import { getAllReports, createReport, updateReport, archiveReport } from '../services/incidentService';
import type { IncidentReport, NewIncidentReport, UpdateIncidentReport } from '../types/incident';

export function useIncidentReports() {
    const [reports, setReports] = useState<IncidentReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllReports();
            setReports(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleCreate = async (data: NewIncidentReport) => {
        try {
            await createReport(data);
            await fetchReports(); // auto refresh
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdate = async (id: string, data: UpdateIncidentReport) => {
        try {
            await updateReport(id, data);
            await fetchReports(); // auto refresh
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await archiveReport(id);
            await fetchReports(); // auto refresh
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { reports, loading, error, refresh: fetchReports, handleCreate, handleUpdate, handleDelete };
}