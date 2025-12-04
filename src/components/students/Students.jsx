import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { studentService } from "../../services/studentService";
import StudentHeader from "./StudentHeader";
import StudentTable from "./StudentTable";
import StudentDetailModal from "./StudentDetailModal";

const HEADERS = [
  "ID",
  "Nombre Completo",
  "Telefono",
  "Pais",
  "Escuela",
  "Controller",
  "Acciones",
];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Cargar estudiantes
  useEffect(() => {
    fetchStudents();
  }, []);

  // Obtener estudiantes
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await studentService().getAll();

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudiantes en barra de busqueda
  const getFilteredStudents = () => {
    if (!Array.isArray(students)) return [];

    if (!searchTerm.trim()) return students;

    return students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.full_name?.toLowerCase().includes(searchLower) ||
        student.phone?.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredStudents = getFilteredStudents();

  // Handlers
  const handleView = (studentId) => {
    setSelectedStudentId(studentId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStudentId(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <StudentHeader
        onCreateStudent={() => alert("Crear estudiante próximamente")}
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
              Cargando estudiantess...
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div>
            <div className="text-lg text-red-600 mb-3">Error: {error}</div>
            <button
              onClick={fetchStudents}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {students.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div className="mt-4 text-lg text-gray-500">
                No hay categorías registradas
              </div>
              <button
                onClick={() => alert("Crear estudiante próximamente")}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Crear primer estudiante
              </button>
            </div>
          ) : filteredStudents.length === 0 && searchTerm ? (
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
                No se encontraron estudiantes con "{searchTerm}"
              </div>
            </div>
          ) : (
            /* Tabla con resultados */
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {filteredStudents.length} de {students.length}{" "}
                estudiantes
              </div>
              <Table headers={HEADERS}>
                {filteredStudents.map((student) => (
                  <StudentTable
                    key={student.id}
                    student={student}
                    onView={handleView}
                  />
                ))}
              </Table>
            </>
          )}
        </>
      )}

      {/* Modal de detalle del estudiante con PDF */}
      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        studentId={selectedStudentId}
      />
    </div>
  );
}
