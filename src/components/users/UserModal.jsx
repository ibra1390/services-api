import React, { useState, useMemo, useEffect } from "react";
import Modal from "../common/Modal";
import { schoolService, dataService } from "../../services/dataService";

// Formulario para crear y editar usuarios
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
  const [countries, setCountries] = useState([]);

  // Cargar datos necesarios solo al crear usuario
  useEffect(() => {
    if (isOpen && !user) {
      const loadData = async () => {
        try {
          const [schoolsData, controllersData, recruitersData, countriesData] =
            await Promise.all([
              schoolService().getAll(),
              dataService().getControllers(),
              dataService().getRecruiters(),
              dataService().getCountries(),
            ]);

          setSchools(schoolsData);
          setControllers(controllersData);
          setRecruiters(recruitersData);
          setCountries(countriesData);
          console.log("Países cargados:", countriesData); // Debug
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

  // Manejar selección de escuelas con checkboxes
  const handleSchoolToggle = (schoolId) => {
    setFormData((prev) => {
      const schools = prev.schools.includes(schoolId)
        ? prev.schools.filter((id) => id !== schoolId)
        : [...prev.schools, schoolId];
      return { ...prev, schools };
    });
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

    // UPDATE (solo 4 campos permitidos)
    if (user) {
      const updateData = {
        f_name: dataToSend.f_name,
        s_name: dataToSend.s_name,
        f_lastname: dataToSend.f_lastname,
        s_lastname: dataToSend.s_lastname,
      };

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={!user ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primer Nombre *
            </label>
            <input
              type="text"
              name="f_name"
              value={formData.f_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
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
              className="w-full px-3 py-2 border rounded-lg"
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
              required
              className="w-full px-3 py-2 border rounded-lg"
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
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* CAMPOS SOLO PARA CREAR */}
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
                required
                className="w-full px-3 py-2 border rounded-lg"
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
                required
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={1}>Admin</option>
                <option value={2}>Controller</option>
                <option value={3}>Recruiter</option>
                <option value={4}>Student</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <select
                name="country_id"
                value={formData.country_id || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">
                  {countries.length === 0
                    ? "Cargando países..."
                    : "Seleccionar País"}
                </option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

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
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccionar Controller</option>
                    {controllers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.f_name} {c.f_lastname}
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
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccionar Recruiter</option>
                    {recruiters.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.f_name} {r.f_lastname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escuelas *
                  </label>
                  <div className="w-full px-3 py-2 border rounded-lg max-h-[200px] overflow-y-auto bg-gray-50">
                    {schools.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Cargando escuelas...
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {schools.map((school) => (
                          <label
                            key={school.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.schools.includes(school.id)}
                              onChange={() => handleSchoolToggle(school.id)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">
                              {school.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.schools.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      Debe seleccionar al menos una escuela
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {user ? "Actualizar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
