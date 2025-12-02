import React from "react";
import { Navigate, Outlet } from "react-router-dom";
export default function ProtectedRoute({ RolUser }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("role");

  if (!token || !rol) {
    return <Navigate to="/" replace />;
  }

  if (!RolUser.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
