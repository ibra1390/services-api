import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import StatusBadge from "../common/StatusBadge";
import LoadingSpinner from "../common/LoadingSpinner";
import { serviceService } from "../../services/serviceService";
import { formatDate } from "../../utils/dateFormatter";
import { downloadEvidence } from "../../utils/downloadHelper";

export default function ServiceDetailModal({ isOpen, onClose, serviceId }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const loadServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService().getById(serviceId);
      setService(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar detalles del servicio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && serviceId) {
      loadServiceDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, serviceId]);

  const handleDownloadEvidence = async () => {
    if (!serviceId) return;
    setDownloading(true);
    try {
      await downloadEvidence(serviceId);
    } catch {
      alert("Error al descargar evidencia");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Servicio">
      <div className="max-h-[70vh] overflow-y-auto">
        {loading && <LoadingSpinner message="Cargando detalles..." />}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && service && (
          <div className="space-y-4 pr-2">
            {/* Información General */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Información General
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600">ID del Servicio</p>
                  <p className="text-sm font-medium text-gray-900">
                    #{service.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Estado</p>
                  <div className="mt-1">
                    <StatusBadge status={service.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Fecha de Registro</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(service.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Última Actualización</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(service.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Horas de Servicio */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Horas de Servicio
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600">Horas Reportadas</p>
                  <p className="text-xl font-bold text-[#274fff]">
                    {service.amount_reported}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Horas Aprobadas</p>
                  <p className="text-xl font-bold text-green-600">
                    {service.amount_approved || "Pendiente"}
                  </p>
                </div>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Categoría
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  {service.category?.name || "N/A"}
                </p>
                {service.category?.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {service.category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Descripción
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  {service.description || "Sin descripción"}
                </p>
              </div>
            </div>

            {/* Revisor */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Revisor
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  {service.reviewer?.full_name || "Sin asignar"}
                </p>
              </div>
            </div>

            {/* Comentarios del Revisor */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Comentarios del Revisor
              </h3>
              {service.comment ? (
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm text-gray-700">{service.comment}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-500 italic">
                    Sin comentarios del revisor
                  </p>
                </div>
              )}
            </div>

            {/* Evidencia */}
            {service.evidence && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Evidencia
                </h3>
                <button
                  onClick={handleDownloadEvidence}
                  disabled={downloading}
                  className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Descargando...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Descargar evidencia
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Botón Cerrar */}
            <div className="flex justify-end pt-3 border-t sticky bottom-0 bg-white">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
