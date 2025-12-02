import { api } from "../hooks/useAxiosData";

export function dataService() {
  return {
    getAll: async () => {
      const response = await api.get("users");
      return response.data;
    },

    create: async (data) => {
      const response = await api.post("users", data);
      return response.data;
    },
  };
}

export function authService() {
  return {
    login: async (email, password) => {
      const response = await api.post("auth/login", {
        email,
        password,
      });
      return response.data;
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },

    getToken: () => {
      return localStorage.getItem("token");
    },

    getRole: () => {
      return localStorage.getItem("role");
    },

    isAuthenticated: () => {
      return !!localStorage.getItem("token");
    },
  };
}
