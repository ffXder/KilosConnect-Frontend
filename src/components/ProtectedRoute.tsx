import type React from "react";
import { Navigate } from "react-router-dom";
 
type Role = 'admin' | 'custodian';
 
interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}
 
export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const role = localStorage.getItem('role') as Role | null;
 
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && (!role || !allowedRoles.includes(role))) return <Navigate to="/unauthorized" replace />;
 
  return <>{children}</>;
}