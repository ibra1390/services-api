import React from "react";

export default function SchoolTableRow({ 
  school, 
  onEdit,
  isUpdating 
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">{school.id}</td>
      <td className="px-6 py-4 font-medium">{school.name}</td>

      <td className="px-6 py-4 whitespace-nowrap">
        <button
            onClick={() => onEdit(school)}
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
          </button>      </td>
    </tr>
  );
}
