import React, { useEffect, useState, useCallback } from "react";
import Modal from "../common/Modal";
import { studentService } from "../../services/studentService";
import { serviceService } from "../../services/serviceService";
import { generateStudentPDF } from "./StudentPDFGenerator";

export default function StudentDetailModal({ isOpen, onClose, studentId }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const loadStudentDetail = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const data = await studentService().getById(studentId);
      setStudent(data);
    } catch (error) {
      console.error("Error al cargar estudiante:", error);
      alert("Error al cargar los detalles del estudiante");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentDetail();
    }
  }, [isOpen, studentId, loadStudentDetail]);

  const generatePDF = async () => {
    if (!student) return;

    try {
      setGeneratingPDF(true);

      // Cargar detalles completos de cada servicio
      const servicesWithDetails = await Promise.all(
        student.services.map(async (service) => {
          try {
            const details = await serviceService().getById(service.id);
            return details;
          } catch (error) {
            console.error(`Error al cargar servicio ${service.id}:`, error);
            return service;
          }
        })
      );

      // Generar PDF usando el componente separado
      await generateStudentPDF(student, servicesWithDetails);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Cargando información...</div>
        </div>
      </Modal>
    );
  }

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Estudiante">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Información Personal */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Información Personal
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Nombre:</span>
              <p className="text-sm text-gray-900">{student.full_name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <p className="text-sm text-gray-900">{student.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Teléfono:
              </span>
              <p className="text-sm text-gray-900">
                {student.phone || "Sin teléfono"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">País:</span>
              <p className="text-sm text-gray-900">
                {student.student?.country?.name || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Estado:</span>
              <p className="text-sm text-gray-900">{student.status}</p>
            </div>
          </div>
        </div>

        {/* Escuelas */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Escuelas</h3>
          {student.schools && student.schools.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {student.schools.map((school) => (
                <span
                  key={school.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {school.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin escuelas asignadas</p>
          )}
        </div>

        {/* Supervisión */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Supervisión
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Controller:
              </span>
              <p className="text-sm text-gray-900">
                {student.student?.controller?.full_name || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Recruiter:
              </span>
              <p className="text-sm text-gray-900">
                {student.student?.recruiter?.full_name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Historial de Servicios */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Historial de Servicios
          </h3>
          {student.services && student.services.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">
                    {student.services.length}
                  </p>
                  <p className="text-xs text-gray-600">Total Servicios</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {student.services.reduce(
                      (sum, s) => sum + (s.amount_reported || 0),
                      0
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Horas Reportadas</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {student.services.reduce(
                      (sum, s) => sum + (s.amount_approved || 0),
                      0
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Horas Aprobadas</p>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {student.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-3 bg-white rounded border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{service.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          service.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : service.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {service.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Reportadas: {service.amount_reported}h</span>
                      <span>Aprobadas: {service.amount_approved}h</span>
                      <span>
                        {new Date(service.created_at).toLocaleDateString(
                          "es-GT"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              No hay servicios registrados
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              generatePDF();
            }}
            disabled={generatingPDF}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {generatingPDF ? "Generando PDF..." : "Descargar PDF"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
