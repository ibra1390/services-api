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

  // Cargar datos necesarios solo al crear usuario
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

  // ESTADO INICIAL
  const initialState = useMemo(() => {
    if (user) {
      return {
        f_name: user.f_name || "",
        s_name: user.s_name || user.m_name || "",
        f_lastname: user.f_lastname || "",
        s_lastname: user.s_lastname || "",
      };
    }
    return INITIAL_FORM_STATE;
  }, [user]);

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  // ON CHANGE
  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    // select-multiple → escuelas
    if (type === "select-multiple") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => Number(opt.value));
      setFormData((prev) => ({ ...prev, [name]: selected }));
      return;
    }

    let newValue = value;

    if (name === "role_id" || name === "country_id") {
      newValue = value ? Number(value) : null;
    }

    if (type === "number") {
      newValue = value ? Number(value) : null;
    }

    // Cambiar rol → limpiar campos específicos
    if (name === "role_id") {
      if (Number(value) !== 4) {
        return setFormData((prev) => ({
          ...prev,
          role_id: Number(value),
          controller_id: null,
          recruiter_id: null,
          schools: [],
        }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    let dataToSend = { ...formData };

    // Normalizar valores
    dataToSend.role_id = Number(dataToSend.role_id);
    if (dataToSend.country_id) {
      dataToSend.country_id = Number(dataToSend.country_id);
    }

    // STUDENT → requiere controller_id, recruiter_id, schools
    if (dataToSend.role_id === 4) {
      dataToSend.controller_id = Number(dataToSend.controller_id);
      dataToSend.recruiter_id = Number(dataToSend.recruiter_id);
      dataToSend.schools = dataToSend.schools.map((id) => Number(id));
    } else {
      delete dataToSend.controller_id;
      delete dataToSend.recruiter_id;
      delete dataToSend.schools;
    }

    // Eliminar campos vacíos EXCEPTO s_name que debe existir
    Object.keys(dataToSend).forEach((key) => {
      if (key === "s_name") return; // backend la necesita
      if (
        dataToSend[key] === "" ||
        dataToSend[key] === null ||
        dataToSend[key] === undefined
      ) {
        delete dataToSend[key];
      }
    });

    // Log exacto de lo que enviamos
    console.log("📤 Enviando al backend:", dataToSend);

    // UPDATE (solo 4 campos permitidos)
    if (user) {
      const updateData = {
        f_name: dataToSend.f_name,
        s_name: dataToSend.s_name,
        f_lastname: dataToSend.f_lastname,
        s_lastname: dataToSend.s_lastname,
      };

      console.log("📤 UPDATE DATA:", updateData);

      onSubmit(updateData, user.id);
      onClose();
      return;
    }

    // CREATE
    onSubmit(dataToSend);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Editar Usuario" : "Crear Usuario"}
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-300">
              Información Personal
            </h3>
            
            <div className={!user ? "grid grid-cols-2 gap-4" : "space-y-4"}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Primer Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Ej: Juan"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  name="s_name"
                  value={formData.s_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Ej: Carlos"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="f_lastname"
                  value={formData.f_lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Ej: Pérez"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Apellido Materno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="s_lastname"
                  value={formData.s_lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Ej: García"
                />
              </div>
            </div>
          </div>

          {/* CAMPOS SOLO PARA CREAR */}
          {!user && (
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-300">
                Información de Cuenta
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="ejemplo@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Controller</option>
                    <option value={3}>Recruiter</option>
                    <option value={4}>Student</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    País <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="country_id"
                    value={formData.country_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Ej: 1"
                  />
                </div>

                {formData.role_id === 4 && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Controller <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="controller_id"
                        value={formData.controller_id || ""}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                      >
                        <option value="">Seleccionar Controller</option>
                        {controllers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.f_name} {c.f_lastname}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Recruiter <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="recruiter_id"
                        value={formData.recruiter_id || ""}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                      >
                        <option value="">Seleccionar Recruiter</option>
                        {recruiters.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.f_name} {r.f_lastname}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Escuelas <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="schools"
                        multiple
                        value={formData.schools}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white min-h-[100px]"
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
            </div>
          )}
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 -mx-2 px-2">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {user ? "Actualizar Usuario" : "Crear Usuario"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}