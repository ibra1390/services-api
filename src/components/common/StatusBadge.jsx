import React from "react";

const statusConfig = {
  Pending: {
    color: "bg-yellow-100 text-yellow-800",
    label: "Pendiente",
  },
  Approved: {
    color: "bg-green-100 text-green-800",
    label: "Aprobado",
  },
  Rejected: {
    color: "bg-red-100 text-red-800",
    label: "Rechazado",
  },
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    label: "Pendiente",
  },
  approved: {
    color: "bg-green-100 text-green-800",
    label: "Aprobado",
  },
  rejected: {
    color: "bg-red-100 text-red-800",
    label: "Rechazado",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
    >
      {config.label}
    </span>
  );
}
