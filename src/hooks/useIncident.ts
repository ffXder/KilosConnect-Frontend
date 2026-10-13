import { useState, useEffect, useCallback } from "react";
import { 
    getAllReports, 
    createReport, 
    updateReport, 
    archiveReport,
    resolveReport 
} from "../services/incidentService";
import type { IncidentReport, NewIncidentReport, UpdateIncidentReport, ResolveIncidentPayload } from "../types/incident";

export function useIncidentReports(page: number = 1, limit: number = 10) {
    const [reports, setReports] = useState<IncidentReport[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: page,
        totalPages: 1,
        totalReports: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllReports();

            // flexible array extraction
            if (Array.isArray(data)) {
                setReports(data);
            } else if (data && typeof data === "object" && Array.isArray((data as any).incidentReports)) {
                setReports((data as any).incidentReports);
            } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
                setReports((data as any).data);
            } else {
                setReports([]);
            }

            // extract pagination if present
            if (data && typeof data === "object" && (data as any).pagination) {
                setPagination((data as any).pagination);
            }

            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const handleCreate = async (data: NewIncidentReport) => {
        try {
            await createReport(data);
            await fetchReports();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdate = async (id: string, data: UpdateIncidentReport) => {
        try {
            await updateReport(id, data);
            await fetchReports();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleArchive = async (id: string) => {
        try {
            await archiveReport(id);
            await fetchReports();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleResolve = async (incident: IncidentReport, payload: ResolveIncidentPayload) => {
        try {
            await resolveReport(incident._id, payload);
            await fetchReports();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { 
        reports, 
        pagination, 
        loading, 
        error, 
        refresh: fetchReports, 
        handleCreate, 
        handleUpdate, 
        handleArchive,
        handleResolve, 
    };
}