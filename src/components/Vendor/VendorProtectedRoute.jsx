// src/components/Vendor/VendorProtectedRoute.jsx - FIXED
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function VendorProtectedRoute() {
  const { user, isVendor, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isVendor() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}