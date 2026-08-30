export interface IncidentReport {
    _id: string;
    incidentId: string;
    title: string;
    description: string | null;
    area: string;
    severity: "Low" | "Medium" | "High" | "Urgent" | "Critical";
    status: "Open" | "In Progress" | "Resolved";
    affectedAssets: string[];
    reporterType?: "Staff" | "Public";
    reportedBy?: {
        _id: string;
        userId: string;
        firstName: string;
        lastName: string;
    } | null;
    reportedName?: string | null;
    dateAndTime: string;
    isArchived: boolean;
    archivedAt: string | null;
    archivedBy: string | null;
}

// for create
export type NewIncidentReport = Omit<
    IncidentReport, 
    "_id" | "incidentId" | "status" | "reportedBy" | "isArchived" | "archivedAt" | "archivedBy"
> & {
    reporterType?: "Staff" | "Public";
    reportedName?: string | null;
};

//for updates
export type UpdateIncidentReport = Partial<
    Omit<IncidentReport, "_id" | "incidentId" | "reportedBy" | "isArchived" | "archivedAt" | "archivedBy">
>;

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalReports: number;
}

export interface PaginatedIncidentResponse {
  incidentReports: IncidentReport[];
  pagination: Pagination;
}
