import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { categoryService } from "../../services/categoryService";

export default function ServiceModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    amount_reported: "",
    description: "",
    category_id: "",
    evidence: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService().getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount_reported || formData.amount_reported <= 0) {
      newErrors.amount_reported = "Las horas deben ser un número positivo";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error al crear servicio:", error);
      alert("Error al registrar las horas de servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount_reported: "",
      description: "",
      category_id: "",
      evidence: null,
    });
    setErrors({});
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo (solo PDF)
      const validTypes = ["application/pdf"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          evidence: "Solo se permiten archivos PDF",
        });
        return;
      }
      setFormData({ ...formData, evidence: file });
      setErrors({ ...errors, evidence: null });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Horas de Servicio"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cantidad de horas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de Horas <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.amount_reported}
            onChange={(e) =>
              setFormData({ ...formData, amount_reported: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.amount_reported ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: 4"
          />
          {errors.amount_reported && (
            <p className="text-red-500 text-xs mt-1">
              {errors.amount_reported}
            </p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>
          {loadingCategories ? (
            <div className="text-sm text-gray-500">Cargando categorías...</div>
          ) : (
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.category_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {errors.category_id && (
            <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describa las actividades realizadas durante las horas de servicio..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Evidencia (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evidencia (Opcional)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {formData.evidence && (
            <p className="text-sm text-gray-600 mt-1">
              Archivo seleccionado: {formData.evidence.name}
            </p>
          )}
          {errors.evidence && (
            <p className="text-red-500 text-xs mt-1">{errors.evidence}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Formato permitido: PDF (Máx. 5MB)
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#274fff] text-white rounded-lg hover:bg-[#1e3bb8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Registrar Servicio"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
