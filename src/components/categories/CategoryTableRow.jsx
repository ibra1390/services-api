import React from "react";

export default function CategoryTableRow({ 
  category, 
  onEdit, 
  onDelete,
  isUpdating = false
}) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {category.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{category.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {category.description || "Sin descripción"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          {/* Ver */}
          {/* <button
            onClick={() => onView(category.id)}
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
            */}
          {/* Editar */}
          <button
            onClick={() => onEdit(category)}
            disabled={isUpdating}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            title="Editar"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Eliminar */}
          {/* <button
            onClick={() => onDelete(category.id)}
            disabled={isUpdating}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title="Eliminar"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button> */}
        </div>
      </td>
    </tr>
  );
}