import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// This prevents authenticated users from accessing signin/signup pages
const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't redirect while still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the public route
  return <Outlet />;
};

export default PublicRoute;
