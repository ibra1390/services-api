import React from "react";

export default function ServiceTable({ service, onView, isUpdating }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  // En ServiceTable.jsx, modifica el icono según estado:
const getReviewIcon = () => {
  if (service.status === "Pending") {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  } else {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  }
};

// Y el título:
const getReviewTitle = () => {
  if (service.status === "Pending") {
    return "Revisar servicio pendiente";
  } else {
    return "Ver detalles (ya revisado)";
  }
};

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        #{service.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {service.user?.full_name || "N/A"}
        </div>
        <div className="text-xs text-gray-500">
          {service.user?.email || ""}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {service.category?.name || "Sin categoría"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {service.amount_reported || 0} h
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {service.amount_approved || 0} h
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            service.status
          )}`}
        >
          {service.status || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {service.created_at
          ? new Date(service.created_at).toLocaleDateString("es-GT")
          : "N/A"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          {/* Ver */}
          <button
            onClick={() => onView(service.id)}
            disabled={isUpdating}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Ver detalles"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}