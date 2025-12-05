import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    // Si no está autenticado, redirigir a login
    if (!userRole) {
      navigate("/login", { replace: true });
      return;
    }

    // Si está autenticado, redirigir según su rol
    if (userRole === "Admin") {
      navigate("/admin/users", { replace: true });
    } else if (userRole === "Student") {
      navigate("/student/services", { replace: true });
    } else {
      // Si tiene un rol desconocido, redirigir a login
      navigate("/login", { replace: true });
    }
  }, [navigate, userRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Página no encontrada</p>
        <p className="text-gray-500">Redirigiendo...</p>
      </div>
    </div>
  );
}
