import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth(true); // Enable auth check for protected routes

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { user, isLoading } = useAuth(true); // Enable auth check for admin routes

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};
