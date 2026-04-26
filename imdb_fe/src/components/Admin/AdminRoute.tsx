import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props { children: React.ReactNode }

const AdminRoute: React.FC<Props> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user?.roles?.includes('ROLE_ADMIN')) return <Navigate to="/" replace />;
    return <>{children}</>;
};

export default AdminRoute;