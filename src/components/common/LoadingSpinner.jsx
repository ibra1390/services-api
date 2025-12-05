import React from "react";

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#274fff] mx-auto mb-3"></div>
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
