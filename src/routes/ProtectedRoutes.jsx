import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export const ProtectedRoute = () => {
    const { user, isLoading, error } = useAuth(true); // Enable auth check for protected routes

    // Show loading only if we don't have cached user data
    if (isLoading && !user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // If there's a 401/403 error (truly unauthorized), redirect to login
    if (error?.response?.status === 401 || error?.response?.status === 403) {
        return <Navigate to="/login" replace />;
    }

    // If we have user data (even if there's a network error), allow access
    // This keeps users logged in when server is temporarily unavailable
    if (user) {
        return <Outlet />;
    }

    // No user data and no auth error - redirect to login
    return <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { user, isLoading, error } = useAuth(true); // Enable auth check for admin routes

    // Show loading only if we don't have cached user data
    if (isLoading && !user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // If there's a 401/403 error (truly unauthorized), redirect to home
    if (error?.response?.status === 401 || error?.response?.status === 403) {
        return <Navigate to="/" replace />;
    }

    // If user is admin (even if there's a network error), allow access
    if (user?.role === 'ADMIN') {
        return <Outlet />;
    }

    // Not admin or no user data - redirect to home
    return <Navigate to="/" replace />;
};
