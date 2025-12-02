import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/dataService";

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

    try {
      console.log("Login - Enviando credenciales...");
      const response = await authService().login(email, password);
      console.log("Login - Respuesta completa:", response);

      // El API enví­a el token como cookie, no en el body
      // Solo verificamos que el login fue exitoso
      if (
        response.status === "success" ||
        response.message === "Login successful"
      ) {
        // Guardamos un flag de autenticación
        localStorage.setItem("token", "authenticated"); // Cookie manejada por el navegador
        localStorage.setItem("role", "admin"); // Por defecto, ajustar según necesites

        console.log("Login - Login exitoso, cookie recibida");
        console.log("Login - Redirigiendo a /admin/users");
        navigate("/admin/users");
      } else {
        throw new Error(
          "Error en el login: " + (response.message || "Respuesta inesperada")
        );
      }
    } catch (err) {
      console.error("Login - Error completo:", err);
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
    <div className="h-screen bg-gray-200 flex items-center justify-center">
      <form
        onSubmit={enviarFormulario}
        className="max-w-sm mx-auto bg-slate-900 p-8 rounded-2xl"
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
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required=""
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required=""
            disabled={loading}
          />
        </div>
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              defaultValue=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Submit"}
          </button>
          <button
            onClick={crearCuenta}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            crear cuenta
          </button>
        </div>
      </form>
    </div>
  );
}
