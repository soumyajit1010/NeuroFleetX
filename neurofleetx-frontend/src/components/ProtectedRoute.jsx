import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = !!localStorage.getItem("userEmail");
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const map = {
      admin: "/dashboard/admin",
      customer: "/dashboard/customer",
      driver: "/dashboard/driver",
      fleetmanager: "/dashboard/fleetmanager",
    };
    return <Navigate to={map[userRole] || "/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;