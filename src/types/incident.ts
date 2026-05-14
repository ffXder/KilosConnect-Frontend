export interface IncidentReport {
    _id: string;
    incidentId: string;
    title: string,
    description: string;
    area: string;
    severity: "Low" | "Medium" | "High" | "Urgent" | "Critical";
    status: "Open" | "In Progress" | "Resolved";
    affectedAssets: string[];
    reportedBy: {
        _id: string;
        userId: string;
        firstName: string;
        lastName: string;
    };
    dateAndTime: string;
    isArchived: boolean;
    archivedAt: string | null;
    archivedBy: string | null;
}

// for create
export type NewIncidentReport = Omit<IncidentReport, "_id" | "incidentId" | "status" | "reportedBy" | "isArchived" | "archivedAt" | "archivedBy">;

//for update
export type UpdateIncidentReport = Partial<Omit<IncidentReport, "_id" | "incidentId" | "reportedBy" | "isArchived" | "archivedAt" | "archivedBy">>;