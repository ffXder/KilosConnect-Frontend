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
}

// for create
export type NewIncidentReport = Omit<
    IncidentReport, 
    "_id" | "incidentId" | "status" | "reportedBy"
> & {
    reporterType?: "Staff" | "Public";
    reportedName?: string | null;
};

//for updates
export type UpdateIncidentReport = Partial<
    Omit<IncidentReport, "_id" | "incidentId" | "reportedBy">
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
