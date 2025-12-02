import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
