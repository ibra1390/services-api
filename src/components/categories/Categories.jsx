import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { categoryService } from "../../services/categoryService";
import CategoryHeader from "./CategoryHeader";
import CategoryTableRow from "./CategoryTableRow";
import CategoryModal from "./CategoryModal";

const HEADERS = ["ID", "Nombre", "Descripción", "Acciones"];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar categorias
  useEffect(() => {
    fetchCategories();
  }, []);

  // Obtener categorias
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

  // Filtrar categorias en barra de busqueda
  const getFilteredCategories = () => {
    if (!Array.isArray(categories)) return [];
    
    if (!searchTerm.trim()) return categories;
    
    return categories.filter(category => {
      const searchLower = searchTerm.toLowerCase();
      return (
        category.name?.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
      );
    });
  };
  
  const filteredCategories = getFilteredCategories();

  // Handlers
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreateCategory = () => {
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
        // Editar categoría existente
        await categoryService().update(selectedCategory.id, formData);
        alert("Categoría actualizada correctamente");
      } else {
        // Crear nueva categoría
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
      {/* Header */}
      <CategoryHeader 
        onCreateCategory={handleCreateCategory}
        onSearch={setSearchTerm}
        disabled={loading || !!error || isSubmitting}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          {/* Empty State */}
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="mt-4 text-lg text-gray-500">
                No hay categorías registradas
              </div>
              <button
                onClick={handleCreateCategory}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Crear primera categoría
              </button>
            </div>
          ) : filteredCategories.length === 0 && searchTerm ? (
            /* No Search Results */
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="mt-4 text-lg text-gray-500">
                No se encontraron categorías con "{searchTerm}"
              </div>
            </div>
          ) : (
            /* Tabla con resultados */
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {filteredCategories.length} de {categories.length} categorías
              </div>
              <Table headers={HEADERS}>
                {filteredCategories.map((category) => (
                  <CategoryTableRow
                    key={category.id}
                    category={category}
                    onEdit={handleEdit}
                    isUpdating={isSubmitting}
                  />
                ))}
              </Table>
            </>
          )}
        </>
      )}

      {/* Modal para crear / editar */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        category={selectedCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}