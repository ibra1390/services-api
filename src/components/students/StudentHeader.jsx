import React, { useState } from "react";

export default function StudentHeader({ onSearch, disabled }) {
  const [search, setSearch] = useState("");

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  // Limpiar la búsqueda
  const handleClearSearch = () => {
    setSearch("");
    onSearch("");
  };
  return (
    <div className="mb-6">
      {/* Título y botón de crear */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Estudiantes</h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input de búsqueda */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar Edtudiante..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={disabled}
        />

        {/* Botón para limpiar */}
        {search && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-3 flex items-center"
            disabled={disabled}
            type="button"
          >
            <svg
              className="w-5 h-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
