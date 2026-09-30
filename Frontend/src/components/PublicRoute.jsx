import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Store/auth";

const PublicRoute = () => {
    const { isLoggedIn, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (isLoggedIn) {
        const from = location.state?.from?.pathname || "/";
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;