import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  console.log("ProtectedRoute - Token:", token ? "existe" : "no existe");

  if (!token) {
    console.log("ProtectedRoute - Redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  return children;
}
