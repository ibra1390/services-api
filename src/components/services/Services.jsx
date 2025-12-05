import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { serviceService } from "../../services/serviceService";
import ServiceHeader from "./ServiceHeader";
import ServiceTable from "./ServiceTable";
import ServiceReviewModal from "./ServiceReviewModal"; // ← Importar el modal

const HEADERS = [
  "ID",
  "Estudiante",
  "Tipo de Servicio",
  "Horas Reportadas",
  "Horas Aprobadas",
  "Estado",
  "Fecha de Creación",
  "Acciones",
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // ← Estado para modal
  const [selectedServiceId, setSelectedServiceId] = useState(null); // ← ID seleccionado

  // Cargar servicios
  useEffect(() => {
    fetchServices();
  }, []);

  // Obtener servicios
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await serviceService().getAll();

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar servicios en barra de búsqueda
  const getFilteredServices = () => {
    if (!Array.isArray(services)) return [];

    if (!searchTerm.trim()) return services;

    return services.filter((service) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        service.user?.full_name?.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        service.category?.name?.toLowerCase().includes(searchLower) ||
        service.status?.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredServices = getFilteredServices();

  // Handler para abrir modal de revisión
  const handleReview = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <ServiceHeader
        onSearch={setSearchTerm}
        disabled={loading || !!error}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div className="text-lg text-gray-600">
              Cargando servicios...
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div>
            <div className="text-lg text-red-600 mb-3">Error: {error}</div>
            <button
              onClick={fetchServices}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {services.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <div className="mt-4 text-lg text-gray-500">
                No hay servicios registrados
              </div>
            </div>
          ) : filteredServices.length === 0 && searchTerm ? (
            /* No Search Results */
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="mt-4 text-lg text-gray-500">
                No se encontraron servicios con "{searchTerm}"
              </div>
            </div>
          ) : (
            /* Tabla con resultados */
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {filteredServices.length} de {services.length}{" "}
                servicios
              </div>
              <Table headers={HEADERS}>
                {filteredServices.map((service) => (
                  <ServiceTable
                    key={service.id}
                    service={service}
                    onView={handleReview} // ← Cambiar a handleReview
                  />
                ))}
              </Table>
            </>
          )}
        </>
      )}

      {/* Modal de Revisión */}
      <ServiceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedServiceId(null);
        }}
        serviceId={selectedServiceId}
        onUpdate={fetchServices}
      />
    </div>
  );
}