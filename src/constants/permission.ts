export interface PermissionOption {
  value: string;
  label: string;
}

export interface PermissionGroup {
  key: string;
  label: string;
  options: PermissionOption[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "users",
    label: "Manage Users",
    options: [
      { value: "users:read", label: "View users" },
      { value: "users:write", label: "Create and edit users" },
      { value: "users:delete", label: "Archive users" },
    ],
  },
  {
    key: "asset",
    label: "Asset Registry",
    options: [
      { value: "asset:read", label: "View assets" },
      { value: "asset:create", label: "Add assets" },
      { value: "asset:update", label: "Edit assets" },
      { value: "asset:delete", label: "Archive assets" },
    ],
  },
  {
    key: "lost_found",
    label: "Lost And Found",
    options: [
      { value: "lost_found:read", label: "View items" },
      { value: "lost_found:create", label: "Log items" },
      { value: "lost_found:update", label: "Edit items" },
      { value: "lost_found:delete", label: "Archive items" },
    ],
  },
  {
    key: "incident",
    label: "Incident Reports",
    options: [
      { value: "incident:read", label: "View incidents" },
      { value: "incident:create", label: "Report incidents" },
      { value: "incident:update", label: "Edit incidents" },
      { value: "incident:resolve", label: "Resolve incidents" },
      { value: "incident:delete", label: "Archive incidents" },
    ],
  },
  {
    key: "audit",
    label: "Audit logs",
    options: [{ value: "audit:read", label: "View audit logs" }],
  },
  {
    key: "facility",
    label: "Facility",
    options: [
      { value: "facility:read", label: "View facility (read only)" },
      { value: "facility:manage", label: "Manage facility (system-wide)" },
    ],
  },
];