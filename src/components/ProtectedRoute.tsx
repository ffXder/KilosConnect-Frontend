import type React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isLoggedIn = !!localStorage.getItem('JwTtoken');

    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

