import React from "react";

const USER_FIELDS = [
  { key: "f_name", label: "Primer Nombre" },
  { key: "m_name", label: "Segundo Nombre" },
  { key: "f_lastname", label: "Primer Apellido" },
  { key: "s_lastname", label: "Segundo Apellido" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Teléfono" },
  { key: "status", label: "Estado" },
];

function InfoField({ label, value, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
      />
    </div>
  );
}

export default function UserInfoFields({ user, columns = 2 }) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {USER_FIELDS.map((field) => (
        <InfoField
          key={field.key}
          label={field.label}
          value={user[field.key]}
          type={field.type}
        />
      ))}

      {user.schools && user.schools.length > 0 && (
        <div className={`col-span-${columns}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escuelas
          </label>
          <div className="flex flex-wrap gap-2">
            {user.schools.map((school) => (
              <span
                key={school.id}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {school.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
