import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { categoryService } from "../../services/categoryService";
import CategoryHeader from "./CategoryHeader";
import CategoryTableRow from "./CategoryTableRow";
import CategoryModal from "./CategoryModal";
import CategoryCard from "./CategoryCard";

const HEADERS = ["ID", "Nombre", "Descripción", "Acciones"];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👈 Obtener rol del usuario
  const role = localStorage.getItem("role");
  const isStudent = role === "Student"; // 👈 bandera para estudiante (corregido)

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService().getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCategories = () => {
    if (!Array.isArray(categories)) return [];

    if (!searchTerm.trim()) return categories;

    return categories.filter((category) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        category.name?.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredCategories = getFilteredCategories();

  // Handlers (solo Admin puede usarlos)
  const handleEdit = (category) => {
    if (isStudent) return; // 👈 estudiante NO edita
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreateCategory = () => {
    if (isStudent) return; // 👈 estudiante NO crea
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (selectedCategory) {
        await categoryService().update(selectedCategory.id, formData);
        alert("Categoría actualizada correctamente");
      } else {
        await categoryService().create(formData);
        alert("Categoría creada correctamente");
      }

      handleCloseModal();
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header con título solo para estudiantes */}
      {isStudent && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Categorías de Servicio
          </h1>
          <p className="text-gray-600 mt-1">
            Conoce las diferentes categorías disponibles para registrar tus
            horas de servicio
          </p>
        </div>
      )}

      {/* 👇 Barra de búsqueda y botón crear (solo Admin) */}
      {!isStudent && (
        <CategoryHeader
          onCreateCategory={handleCreateCategory}
          onSearch={setSearchTerm}
          disabled={loading || !!error || isSubmitting}
        />
      )}

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
            <div className="text-lg text-gray-600">Cargando categorías...</div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div>
            <div className="text-lg text-red-600 mb-3">Error: {error}</div>
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
          {!isStudent && (
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {filteredCategories.length} de {categories.length}{" "}
              categorías
            </div>
          )}

          {/* Vista de Cards para Estudiantes */}
          {isStudent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            /* Vista de Tabla para Admin */
            <Table headers={HEADERS}>
              {filteredCategories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  isUpdating={isSubmitting}
                  isStudent={isStudent}
                />
              ))}
            </Table>
          )}
        </>
      )}

      {/* Modal: solo Admin */}
      {!isStudent && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          category={selectedCategory}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
