import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { serviceService } from "../../services/serviceService";
import { downloadEvidence } from "../../utils/downloadHelper";

export default function ServiceReviewModal({
  isOpen,
  onClose,
  serviceId,
  onUpdate,
}) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hours, setHours] = useState("");
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("approve");

  // Cargar servicio
  useEffect(() => {
    if (!isOpen || !serviceId) return;
    loadService();
  }, [isOpen, serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await serviceService().getById(serviceId);
      setService(data);
      setHours(data.amount_approved || "");
      setComment(data.comment || "");
      if (data.status === "Rejected") setDecision("reject");
    } catch {
      alert("Error al cargar servicio");
    } finally {
      setLoading(false);
    }
  };

  // Descargar evidencia
  const handleDownloadEvidence = async () => {
    if (!serviceId) return;
    setDownloading(true);
    try {
      await downloadEvidence(serviceId);
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setDownloading(false);
    }
  };

  // Guardar revisión
  const saveReview = async () => {
    if (!hours && decision === "approve") {
      alert("Ingresa las horas a aprobar");
      return;
    }

    if (!comment) {
      alert("Ingresa un comentario");
      return;
    }

    try {
      setSaving(true);
      await serviceService().updateReview(serviceId, {
        amount_approved: decision === "approve" ? parseInt(hours) : 0,
        comment,
        status: decision === "approve" ? "1" : "2",
      });

      onUpdate?.();
      alert("Revisión guardada");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // Revisar para aprobar o rechazar
  const isReviewed =
    service?.status === "Approved" || service?.status === "Rejected";

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cargando...">
        <div className="flex justify-center py-12">
          <div className="text-gray-600">Cargando información...</div>
        </div>
      </Modal>
    );
  }

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Servicio #${serviceId}`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Mensaje si ya revisado */}
        {isReviewed && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700 font-medium">
              {service.status === "Approved"
                ? "✅ Ya aprobado"
                : "❌ Ya rechazado"}
            </p>
            <p className="text-sm text-yellow-600 mt-1">Solo lectura</p>
          </div>
        )}

        {/* Información del servicio */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Información del Servicio
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Estudiante:
              </span>
              <p className="text-sm text-gray-900">{service.user?.full_name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Categoría:
              </span>
              <p className="text-sm text-gray-900">{service.category?.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Horas Reportadas:
              </span>
              <p className="text-sm text-gray-900 font-bold">
                {service.amount_reported || 0}h
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Estado:</span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  service.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : service.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {service.status === "Approved"
                  ? "Aprobado"
                  : service.status === "Rejected"
                  ? "Rechazado"
                  : "Pendiente"}
              </span>
            </div>
          </div>

          {/* Botón de descargar evidencia */}
          <div className="mt-4 pt-3 border-t">
            <span className="text-sm font-medium text-gray-600 mb-2 block">
              Evidencia:
            </span>
            <button
              onClick={handleDownloadEvidence}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center disabled:opacity-50"
            >
              {downloading ? "Descargando..." : "Descargar PDF"}
            </button>
          </div>

          {service.description && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-sm font-medium text-gray-600">
                Descripción:
              </span>
              <p className="text-sm text-gray-900 mt-1">
                {service.description}
              </p>
            </div>
          )}

          {service.comment && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-sm font-medium text-gray-600">
                Comentario:
              </span>
              <p className="text-sm text-gray-900 mt-1 italic">
                "{service.comment}"
              </p>
            </div>
          )}
        </div>

        {/* Formulario de revisión - solo si pendiente */}
        {!isReviewed && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Revisión
            </h3>

            <div className="space-y-4">
              {/* Decisión */}
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Decisión:
                </span>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => setDecision("approve")}
                    className={`px-4 py-2 rounded-lg ${
                      decision === "approve"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => setDecision("reject")}
                    className={`px-4 py-2 rounded-lg ${
                      decision === "reject"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Rechazar
                  </button>
                </div>
              </div>

              {/* Horas (solo si aprobar) */}
              {decision === "approve" && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Horas a aprobar:
                  </span>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="Ej: 5"
                    min="0"
                    max={service?.amount_reported || 100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo: {service?.amount_reported || 0} horas
                  </p>
                </div>
              )}

              {/* Comentario */}
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Comentario:
                </span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Escribe tu comentario..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {isReviewed ? "Cerrar" : "Cancelar"}
          </button>

          {!isReviewed && (
            <button
              onClick={saveReview}
              disabled={saving}
              className={`flex-1 px-4 py-2 text-white rounded-lg ${
                decision === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } disabled:opacity-50`}
            >
              {saving
                ? "Guardando..."
                : decision === "approve"
                ? "Aprobar"
                : "Rechazar"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
