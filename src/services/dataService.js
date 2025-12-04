import { api } from "../hooks/useAxiosData";

export function dataService() {
  return {
    getAll: async () => {
      const response = await api.get("users");
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`users/${id}`);
      return response.data;
    },

    create: async (data) => {
      const response = await api.post("users", data);
      return response.data;
    },

    update: async (id, data) => {
      const response = await api.put(`users/${id}`, data);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(`users/${id}`);
      return response.data;
    },

    // Obtener lista de controllers
    getControllers: async () => {
      const response = await api.get("users");
      // Filtrar solo usuarios con role_id = 2 (Controller)
      return response.data.filter((user) => user.role_id === 2);
    },

    // Obtener lista de recruiters
    getRecruiters: async () => {
      const response = await api.get("users");
      // Filtrar solo usuarios con role_id = 3 (Recruiter)
      return response.data.filter((user) => user.role_id === 3);
    },
  };
}

export function schoolService() {
  return {
    getAll: async () => {
      const response = await api.get("schools");
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`schools/${id}`);
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

    logout: async () => {
      try {
        await api.post("auth/logout");
      } catch (error) {
        console.error("Error al hacer logout:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },

    getProfile: async () => {
      const response = await api.get("auth/profile");
      return response.data;
    },

    changePassword: async (oldPassword, newPassword) => {
      const response = await api.put("auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return response.data;
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
