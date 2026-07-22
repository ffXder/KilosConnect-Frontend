import type { IncidentReport, NewIncidentReport, UpdateIncidentReport } from "../types/incident";
import { apiRequest } from "./authService";

// GET ALL
export const getAllReports = async (): Promise<IncidentReport[]> => {
    const res = await apiRequest('/incident-reports', { method: 'GET' });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load incident reports');
    }
    return res.json();
};

// GET BY ID
export const getReportById = async (id: string): Promise<IncidentReport> => {
    const res = await apiRequest(`/incident-reports/${id}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load incident reports');
    }
    return res.json();
};

// CREATE
export const createReport = async (incidentData: NewIncidentReport): Promise<IncidentReport> => {
    const res = await apiRequest('/incident-reports', {
        method: 'POST',
        body: JSON.stringify(incidentData),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not create incident report');
    }
    return res.json();
};

// UPDATE
export const updateReport = async (id: string, data: UpdateIncidentReport): Promise<IncidentReport> => {
    console.log('Updating incident with id:', id);
    const res = await apiRequest(`/incident-reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not update incident report');
    }
    return res.json();
};

// PATCH
export const archiveReport = async (id: string): Promise<void> => {
    const res = await apiRequest(`/incident-reports/${id}/archive`, { method: 'PATCH' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not archive report');
    }
};

export const unarchiveReport = async (id: string): Promise<void> => {
    const res = await apiRequest(`/incident-reports/${id}/unarchive`, { method: 'PATCH'});
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to unarchive report');
    }
}

//GET ARCHIVED
export const getArchivedReports = async (): Promise<IncidentReport[]> => {
    const res = await apiRequest('/incident-reports/archived', { method: 'GET' });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not load archived incident reports');
    }
    return await res.json();
};