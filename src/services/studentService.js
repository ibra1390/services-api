import { api } from "../hooks/useAxiosData";

export function studentService() {
  return {
    //Obtener todas las categorias
    getAll: async () => {
      const response = await api.get("students");
      return response.data;
    },

    //Obtener Categoria por ID
    getById: async (id) => {
      const response = await api.get(`students/${id}`);
      return response.data;
    },
  };
}
