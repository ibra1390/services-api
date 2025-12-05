import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/dataService";
import axios from "axios";
import galaxia from "../image/galaxia.mp4";
import LOGOFUNVALblan from "../image/LOGOFUNVALblan.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function enviarFormulario(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Limpiar localStorage antes de iniciar sesión
    localStorage.removeItem("role");

    try {
      const response = await authService().login(email, password);

      // El API solo devuelve cookie. Validamos éxito:
      const success =
        response.status === "success" ||
        response.message === "Login successful";

      if (!success) {
        throw new Error(
          "Error en el login: " + (response.message || "Desconocido")
        );
      }

      // Obtener perfil después del login
      const profileResponse = await axios.get(
        "https://www.hs-service.api.crealape.com/api/v1/auth/profile",
        {
          withCredentials: true,
        }
      );

      const roleName = profileResponse.data.role?.name;

      if (!roleName) {
        throw new Error("No se pudo obtener el rol del usuario.");
      }

      // Guardar el rol real del backend
      localStorage.setItem("role", roleName);

      // Redirección según rol
      if (roleName === "Admin") {
        navigate("/admin/users");
      } else if (roleName === "Student") {
        navigate("/student");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Credenciales incorrectas"
      );
    } finally {
      setLoading(false);
    }
  }

  function crearCuenta() {
    navigate("/newuser");
  }

  return (
    <div className="h-screen flex relativ items-center justify-center flex-col gap-30">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={galaxia} type="video/mp4" />
      </video>
      <img src={LOGOFUNVALblan} alt="" className="w-2xl opacity-80 p-8" />
      <form
        onSubmit={enviarFormulario}
        className="max-w-sm md:w-2xl mx-auto bg-slate-900 p-8 rounded-2xl opacity-90"
      >
        {error && (
          <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="your.email@funval.com"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="**********"
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
              disabled={loading}
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remember me
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Submit"}
          </button>

          {/* <button
            onClick={crearCuenta}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            crear cuenta
          </button> */}
        </div>
      </form>
    </div>
  );
}
