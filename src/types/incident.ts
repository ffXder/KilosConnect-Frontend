export interface affectedAsset {
    _id: string;
    assetId: string;
    name: string;
    condition: string;
    area: string;
}


export interface IncidentReport {
    _id: string;
    incidentId: string;
    title: string;
    description: string | null;
    area: string;
    severity: "Low" | "Medium" | "High" | "Urgent" | "Critical";
    status: "Open" | "In Progress" | "Resolved";
    asset?: affectedAsset | string | affectedAsset[] | null;
    affectedAssets?: Array<affectedAsset | string>;
    resolutionNote?: string | null;
    reporterType?: "Staff" | "Public";
    reportedBy?: {
        _id: string;
        userId: string;
        firstName: string;
        lastName: string;
    } | null;
    reportedName?: string | null;
    dateAndTime: string;
    createdAt?: string;
}

export interface ResolveIncidentPayload {
    resolutionNote: string;
    repair?: {
        assetId: string;
        cost: number;
        repairDate: string;
        description?: string;
    };
}

// for create
export type NewIncidentReport = Omit<
    IncidentReport, 
    "_id" | "incidentId" | "status" | "reportedBy" | "asset" | "affectedAssets"
> & {
    asset?: string;
    affectedAssets?: string[];
    reporterType?: "Staff" | "Public";
    reportedName?: string | null;
};

//for updates
export type UpdateIncidentReport = Partial<
    Omit<IncidentReport, "_id" | "incidentId" | "reportedBy" | "asset" | "affectedAssets">
> & {
    asset?: string;
    affectedAssets?: string[];
};
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalReports: number;
}

export interface PaginatedIncidentResponse {
  incidentReports: IncidentReport[];
  pagination: Pagination;
}
