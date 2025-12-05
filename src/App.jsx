import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";

import Users from "./components/users/Users";
import Categories from "./components/categories/Categories";
import Roles from "./components/roles/Roles";
import Students from "./components/students/Students";
import Schools from "./components/schools/Schools";
import Services from "./components/services/Services";
import StudentServices from "./components/services/StudentServices";

import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFound from "./components/common/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/** -------------------------
       *   RUTAS DE ADMIN
       *  ------------------------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute RolUser={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<div className="p-8">Perfil</div>} />
        <Route path="categories" element={<Categories />} />
        <Route path="services" element={<Services />} />
        <Route path="schools" element={<Schools />} />
        <Route path="roles" element={<Roles />} />
        <Route path="students" element={<Students />} />
        {/* Ruta catch-all para rutas admin inválidas */}
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Route>

      {/** -------------------------
       *   RUTAS DE STUDENT
       *  ------------------------- */}
      <Route
        path="/student"
        element={
          <ProtectedRoute RolUser={["Student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/services" replace />} />
        <Route path="services" element={<StudentServices />} />
        <Route path="categories" element={<Categories />} />
        {/* Ruta catch-all para rutas student inválidas */}
        <Route path="*" element={<Navigate to="/student/services" replace />} />
      </Route>

      {/* Ruta catch-all global para cualquier otra ruta inválida */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
