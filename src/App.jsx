import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Users from "./components/users/Users";
import Categories from "./components/categories/Categories";
import Roles from "./components/roles/Roles";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Students from "./components/students/Students";
import Schools from "./components/schools/Schools";
import Services from "./components/services/Services";

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
        <Route path="categories" element={<Categories />} />
        <Route
          path="services"
          element={<Services />}
        />
        <Route path="schools" element={<Schools/>} />
        <Route path="roles" element={<Roles />} />
        <Route path="students" element={<Students></Students>} />
      </Route>
    </Routes>
  );
}
