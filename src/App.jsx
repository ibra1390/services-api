import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Users from "./components/users/Users";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<div className="p-8">Perfil</div>} />
        <Route
          path="categories"
          element={<div className="p-8">Categorías</div>}
        />
        <Route
          path="services"
          element={<div className="p-8">Revisión Servicios</div>}
        />
        <Route path="schools" element={<div className="p-8">Escuelas</div>} />
        <Route path="roles" element={<div className="p-8">Roles</div>} />
      </Route>
    </Routes>
  );
}
