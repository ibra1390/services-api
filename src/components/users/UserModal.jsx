import React, { useState, useMemo } from "react";
import Modal from "../common/Modal";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  role: "Usuario",
  active: true,
};

export default function UserModal({ isOpen, onClose, onSubmit, user = null }) {
  // Calcular el estado inicial basado en el usuario
  const initialState = useMemo(() => {
    if (user) {
      return {
        f_name: user.f_name || "",
        email: user.email || "",
        role: user.role || "Usuario",
        active: user.active ?? true,
      };
    }
    return INITIAL_FORM_STATE;
  }, [user]);

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(INITIAL_FORM_STATE);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Editar Usuario" : "Crear Usuario"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="f_name"
            value={formData.f_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Usuario">Usuario</option>
            <option value="Admin">Admin</option>
            <option value="Moderador">Moderador</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">
            Usuario Activo
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {user ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
