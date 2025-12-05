import React, { useEffect, useState, useCallback } from "react";
import Table from "../common/Table";
import ServiceModal from "./ServiceModal";
import ServiceDetailModal from "./ServiceDetailModal";
import ServiceStats from "./ServiceStats";
import EmptyServiceState from "./EmptyServiceState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import { serviceService } from "../../services/serviceService";
import { authService } from "../../services/dataService";
import { api } from "../../hooks/useAxiosData";

const HEADERS = [
  "ID",
  "Fecha",
  "Categoría",
  "Horas Reportadas",
  "Horas Aprobadas",
  "Estado",
  "Revisor",
  "Acciones",
];

function ServiceTableRow({ service, onViewDetails }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {service.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formatDate(service.created_at, false)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {service.category?.name || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
        {service.amount_reported}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
        {service.amount_approved || "Pendiente"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={service.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {service.reviewer?.full_name || "Sin asignar"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={() => onViewDetails(service.id)}
          className="text-[#274fff] hover:text-[#1e3bb8] font-medium transition-colors"
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
      </td>
    </tr>
  );
}

export default function StudentServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      const data = await authService().getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  }, []);

  const loadServices = useCallback(async () => {
    if (!profile) return;

    try {
      setLoading(true);
      setError(null);
      const data = await serviceService().getAll();

      // Filtrar solo los servicios del estudiante actual
      const filteredServices = data.filter(
        (service) => service.user?.id === profile.id
      );

      setServices(filteredServices);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener servicios:", err);
    } finally {
      setLoading(false);
    }
  }, [profile]);
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      loadServices();
    }
  }, [profile, loadServices]);

  const handleCreateService = async (formData) => {
    try {
      const data = new FormData();
      data.append("amount_reported", formData.amount_reported);
      data.append("description", formData.description);
      data.append("category_id", formData.category_id);

      if (formData.evidence) {
        data.append("evidence", formData.evidence);
      }

      await api.post("services", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await loadServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear servicio:", error);
      throw error;
    }
  };

  const handleViewDetails = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y registra tus horas de servicio social
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#274fff] text-white rounded-lg hover:bg-[#1e3bb8] transition-colors flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Registrar Horas
        </button>
      </div>

      {/* Resumen de horas */}
      {profile && <ServiceStats services={services} />}

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-lg text-gray-600">Cargando servicios...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      ) : services.length === 0 ? (
        <EmptyServiceState onRegister={() => setIsModalOpen(true)} />
      ) : (
        <Table headers={HEADERS}>
          {services.map((service) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              onViewDetails={handleViewDetails}
            />
          ))}
        </Table>
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateService}
      />

      <ServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        serviceId={selectedServiceId}
      />
    </div>
  );
}
