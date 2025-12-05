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

import ProtectedRoute from "./components/common/ProtectedRoute";

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
        <Route index element={<div className="p-8">Bienvenido estudiante</div>} /> 
      </Route>
    </Routes>
  );
}
