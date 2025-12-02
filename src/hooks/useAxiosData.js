import axios from "axios";
//instancia creada
export const api = axios.create({
  baseURL: "https://www.hs-service.api.crealape.com/api/v1/",
  headers: { "Content-Type": `application/json` },
  withCredentials: true,
});
//intereceptor de request (LA SALIDA)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
//INTERCEPTOR DE RESPUESTA (LA LLEGADA)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Sesión expirada, redirigiendo a Login");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
