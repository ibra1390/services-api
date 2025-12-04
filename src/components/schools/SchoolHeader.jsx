import React, { useState } from "react";

export default function SchoolHeader({ onCreateSchool, onSearch, disabled }) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Escuelas</h1>
        <button
          onClick={onCreateSchool}
          disabled={disabled}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 gap-2"
        >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        Nueva Escuela
        </button>
      </div>

      <div className="max-w-md relative">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar escuelas..."
          className="w-full pl-4 pr-10 py-2 border rounded-lg"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
