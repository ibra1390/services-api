import React from "react";

export default function StudentTable({ student, onView, isUpdating }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {student.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {student.full_name}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {student.phone || "Sin telefono"}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {student.student.country.name || "Sin Pais"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {student.schools && student.schools.length > 0
            ? student.schools.map((s) => s.name).join(", ")
            : "Sin Escuela"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">
          {student.student.controller.full_name || "Sin Escuela"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          {/* Ver */}
          <button
            onClick={() => onView(student.id)}
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
