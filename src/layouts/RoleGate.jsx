import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function RoleGate({ adminComponent, studentComponent }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await authService.getProfile();
        setRole(data.role?.name);
      } catch (err) {
        console.error(err);
        return setRole("NONE"); // Forzar logout
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!role) return <Navigate to="/" replace />;

  if (role === "Admin") return adminComponent;
  if (role === "Student") return studentComponent;

  return <Navigate to="/" replace />;
}
