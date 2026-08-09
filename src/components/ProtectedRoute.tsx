import type React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRole } from '../services/authService'

type Role = "admin" | "custodian";

interface Props {
  children?: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const role = getRole();

  // if token is expired, invalid redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // if roles are not allow redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}