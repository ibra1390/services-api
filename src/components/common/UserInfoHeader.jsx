import React from "react";

export default function UserInfoHeader({ user }) {
  return (
    <div className="bg-[#274fff] rounded-lg p-6 text-white">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#274fff] font-bold text-2xl">
          {user.f_name?.charAt(0)}
          {user.f_lastname?.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold">{user.full_name}</h3>
          <p className="text-indigo-100">{user.role?.name || "Usuario"}</p>
        </div>
      </div>
    </div>
  );
}
