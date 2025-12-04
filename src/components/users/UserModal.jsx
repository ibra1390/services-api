import React, { useState, useMemo, useEffect } from "react";
import Modal from "../common/Modal";
import { schoolService, dataService } from "../../services/dataService";

const INITIAL_FORM_STATE = {
  f_name: "",
  s_name: "",
  f_lastname: "",
  s_lastname: "",
  email: "",
  password: "",
  role_id: 1,
  schools: [],
  controller_id: null,
  recruiter_id: null,
  country_id: null,
};

export default function UserModal({ isOpen, onClose, onSubmit, user = null }) {
  const [schools, setSchools] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  // Cargar escuelas, controllers y recruiters al abrir el modal
  useEffect(() => {
    if (isOpen && !user) {
      const loadData = async () => {
        try {
          const [schoolsData, controllersData, recruitersData] =
            await Promise.all([
              schoolService().getAll(),
              dataService().getControllers(),
              dataService().getRecruiters(),
            ]);
          setSchools(schoolsData);
          setControllers(controllersData);
          setRecruiters(recruitersData);
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
      };
      loadData();
    }
  }, [isOpen, user]);
  // Calcular el estado inicial basado en el usuario
  const initialState = useMemo(() => {
    if (user) {
      // Para editar: solo campos editables
      return {
        f_name: user.f_name || "",
        s_name: user.m_name || user.s_name || "", // Manejar m_name o s_name
        f_lastname: user.f_lastname || "",
        s_lastname: user.s_lastname || "",
      };
    }
    // Para crear: todos los campos
    return INITIAL_FORM_STATE;
  }, [user]);

  const [formData, setFormData] = useState(initialState);

  // Resetear el formulario cuando cambia el usuario
  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === "select-multiple") {
      // Manejar selección múltiple para escuelas
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));
      setFormData((prev) => ({ ...prev, [name]: selectedValues }));
    } else {
      // Manejar country_id como número
      let newValue = value;
      if (name === "country_id") {
        newValue = value ? parseInt(value) : null;
      } else if (type === "number") {
        newValue = value ? parseInt(value) : null;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        // Resetear campos específicos de estudiantes si cambia el rol
        ...(name === "role_id" &&
          newValue !== 4 && {
            controller_id: null,
            recruiter_id: null,
            schools: [],
          }),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user) {
      // Para editar: solo enviar campos editables
      const updateData = {
        f_name: formData.f_name,
        s_name: formData.s_name,
        f_lastname: formData.f_lastname,
        s_lastname: formData.s_lastname,
      };
      onSubmit(updateData, user.id);
    } else {
      // Para crear: enviar todos los campos necesarios
      onSubmit(formData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Editar Usuario" : "Crear Usuario"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Layout en columnas para el formulario de crear */}
        <div className={!user ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {/* Campos comunes para crear y editar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primer Nombre *
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
              Segundo Nombre
            </label>
            <input
              type="text"
              name="s_name"
              value={formData.s_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido Paterno *
            </label>
            <input
              type="text"
              name="f_lastname"
              value={formData.f_lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido Materno *
            </label>
            <input
              type="text"
              name="s_lastname"
              value={formData.s_lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Campos solo para crear */}
        {!user && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
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
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={1}>Admin</option>
                <option value={2}>Controller</option>
                <option value={3}>Recruiter</option>
                <option value={4}>Student</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País * (ID numérico)
              </label>
              <input
                type="number"
                name="country_id"
                value={formData.country_id || ""}
                onChange={handleChange}
                placeholder="Ej: 1 para Guatemala, 2 para México..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
              />
            </div>

            {/* Campos adicionales para estudiantes */}
            {formData.role_id === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Controller *
                  </label>
                  <select
                    name="controller_id"
                    value={formData.controller_id || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Seleccionar Controller</option>
                    {controllers.map((controller) => (
                      <option key={controller.id} value={controller.id}>
                        {controller.f_name} {controller.f_lastname}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recruiter *
                  </label>
                  <select
                    name="recruiter_id"
                    value={formData.recruiter_id || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Seleccionar Recruiter</option>
                    {recruiters.map((recruiter) => (
                      <option key={recruiter.id} value={recruiter.id}>
                        {recruiter.f_name} {recruiter.f_lastname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escuelas * (Mantén presionado Ctrl/Cmd para seleccionar
                    múltiples)
                  </label>
                  <select
                    name="schools"
                    multiple
                    value={formData.schools}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                    required
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        )}

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
            {user ? "Actualizar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
