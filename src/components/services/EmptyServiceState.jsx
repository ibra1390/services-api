import React from "react";

export default function EmptyServiceState({ onRegister }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-lg text-gray-600 mb-2">
        No tienes servicios registrados
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Comienza registrando tus primeras horas de servicio
      </p>
      <button
        onClick={onRegister}
        className="px-4 py-2 bg-[#274fff] text-white rounded-lg hover:bg-[#1e3bb8] transition-colors"
        style={{ backgroundColor: "#274fff" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#1e3bb8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#274fff")
        }
      >
        Registrar Horas
      </button>
    </div>
  );
}
