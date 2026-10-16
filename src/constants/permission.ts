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
    key: "archive",
    label: "Archive",
    options: [
      { value: "archive:read", label: "View archives" },
      { value: "archive:restore", label: "Restore archive" },
    ],
  },
  {
    key: "audit",
    label: "Audit logs",
    options: [{ value: "audit:read", label: "View audit logs" }],
  },
  {
    key: "task",
    label: "Manage Task",
    options: [
      { value: "task:read", label: "View tasks" },
      { value: "task:initialize", label: "Initialize Task" },
    ],
  },
];

export const PERMISSIONS = {
  USERS_READ: 'users:read',
  ARCHIVE_READ: 'archive:read',
  AUDIT_READ: 'audit:read',
  TASK_READ: 'task:read',
  TASK_INITIALIZE: 'task:initialize'
} as const