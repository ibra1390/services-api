import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ RolUser, children }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("role");

  if (!token || !rol) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(RolUser) ? RolUser : [RolUser];

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
