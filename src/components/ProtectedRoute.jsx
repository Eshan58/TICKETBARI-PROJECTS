import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
