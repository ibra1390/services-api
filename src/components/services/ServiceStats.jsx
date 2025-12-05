import React from "react";

export default function ServiceStats({ services }) {
  const totalReported = services.reduce(
    (sum, s) => sum + (s.amount_reported || 0),
    0
  );

  const totalApproved = services.reduce(
    (sum, s) => sum + (s.amount_approved || 0),
    0
  );

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Horas Reportadas</p>
        <p className="text-2xl font-bold" style={{ color: "#274fff" }}>
          {totalReported}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Horas Aprobadas</p>
        <p className="text-2xl font-bold text-green-600">{totalApproved}</p>
      </div>
    </div>
  );
}
