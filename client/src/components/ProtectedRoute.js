// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isLoggedIn } = useContext(AuthContext);

    // If not logged in, redirect to the home page
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;