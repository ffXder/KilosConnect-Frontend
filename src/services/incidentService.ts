import type { IncidentReport, NewIncidentReport, UpdateIncidentReport, ResolveIncidentPayload, PaginatedIncidentResponse } from "../types/incident";
import { apiRequest } from "./authService";

// GET ALL
export const getAllReports = async (): Promise<PaginatedIncidentResponse> => {
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

// PUT
export const resolveReport = async (id: string, payload: ResolveIncidentPayload): Promise<IncidentReport> => {
    const res = await apiRequest(`/incident-reports/${id}/resolve`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not resolve incident report');
    }
    return res.json();
};

// POST
export const archiveReport = async (id: string): Promise<void> => {
    const res = await apiRequest(`/incident-reports/${id}/archive`, { method: 'POST' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not archive report');
    }
};
