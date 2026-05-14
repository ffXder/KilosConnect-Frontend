import type { IncidentReport } from "./incident";

export interface Consumable {
    _id: string;
    consumableId: string;
    name: string;
    category: string;
    unit: string;
    quantity: number;
    lowStockAlert: number;
    location: string;
    description?: string;
    isArchived: boolean;
    archivedAt: string | null;
    archivedBy: string | null;
}

//for create
export type NewIncidentReport = Omit<IncidentReport, "_id" | "incidentId" | "status" | "reportedBy" | "isArchived" | "archivedAt" | "archivedBy">;

export type UpdateIncidentReport = Partial<Omit<IncidentReport, "_id" | "incidentId" | "reportedBy" | "isArchived" | "archivedAt" | "archivedBy">>;