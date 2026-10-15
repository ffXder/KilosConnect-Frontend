import type React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRole, getPermissions } from '../services/authService';

type Role = "super_admin" | "admin" | "custodian";

interface Props {
  children?: React.ReactNode;
  allowedRoles?: Role[];
  requiredPermission?: string;
}

export default function ProtectedRoute({ children, allowedRoles, requiredPermission }: Props) {
  const role = getRole() as Role | null;
  const permissions = getPermissions();

  // if not logged in redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // ops role check muna
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (role === 'custodian') {
    return children ? <>{children}</> : <Outlet />;
  }
  // super admin bypass all permission checks
  if (role !== 'super_admin' && requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}