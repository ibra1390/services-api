import React from "react";

const UserFilter = React.memo(function UserFilter({
  roleFilter,
  onRoleFilterChange,
  uniqueRoles,
  disabled,
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por Rol
      </label>
      <select
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
        disabled={disabled}
      >
        <option value="all">Todos los roles</option>
        {uniqueRoles
          .filter((role) => role !== "all")
          .map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
      </select>
    </div>
  );
});

export default UserFilter;
