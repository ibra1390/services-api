import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { schoolService } from "../../services/dataService";
import SchoolHeader from "./SchoolHeader";
import SchoolTableRow from "./SchoolTableRow";
import SchoolModal from "./SchoolModal";

const HEADERS = ["ID", "Nombre", "Acciones"];

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchSchools(); }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolService().getAll();
      setSchools(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar las escuelas");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSchools = () => {
    if (!Array.isArray(schools)) return [];

    if (!searchTerm.trim()) return schools;

    return schools.filter(s =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredSchools = getFilteredSchools();

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSchool(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchool(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (selectedSchool) {
        await schoolService().update(selectedSchool.id, formData);
        alert("Escuela actualizada correctamente");
      } else {
        await schoolService().create(formData);
        alert("Escuela creada correctamente");
      }

      handleCloseModal();
      await fetchSchools();

    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <SchoolHeader 
        onCreateSchool={handleCreate}
        onSearch={setSearchTerm}
        disabled={loading || !!error || isSubmitting}
      />

      {loading ? (
        <div className="flex justify-center py-12 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3 text-lg text-gray-600">
            <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none">
              <circle cx="12" cy="12" r="10" strokeWidth="4"></circle>
            </svg>
            Cargando escuelas...
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div>
            <div className="text-lg text-red-600 mb-3">Error: {error}</div>
            <button
              onClick={fetchSchools}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
          {schools.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-lg text-gray-500">No hay escuelas registradas</div>
              <button
                onClick={handleCreate}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Crear primera escuela
              </button>
            </div>
          ) : filteredSchools.length === 0 && searchTerm ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-lg text-gray-500">
                No se encontraron escuelas con "{searchTerm}"
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {filteredSchools.length} de {schools.length} escuelas
              </div>
              <Table headers={HEADERS}>
                {filteredSchools.map(school => (
                  <SchoolTableRow
                    key={school.id}
                    school={school}
                    onEdit={handleEdit}
                    isUpdating={isSubmitting}
                  />
                ))}
              </Table>
            </>
          )}
        </>
      )}

      <SchoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        school={selectedSchool}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
