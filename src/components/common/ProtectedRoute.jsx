import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, RolUser = [] }) {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Si se especificaron roles permitidos, validar que el usuario tenga uno de ellos
  if (RolUser.length > 0 && !RolUser.includes(userRole)) {
    // Redirigir según el rol del usuario
    if (userRole === "Admin") {
      return <Navigate to="/admin/users" replace />;
    } else if (userRole === "Student") {
      return <Navigate to="/student/services" replace />;
    }
    // Si no tiene rol válido, ir a login
    return <Navigate to="/login" replace />;
  }

  return children;
}
