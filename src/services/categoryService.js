import { api } from "../hooks/useAxiosData";

export function categoryService() {
  return {
    //Obtener todas las categorias
    getAll: async () => {
      const response = await api.get("categories");
      return response.data;
    },

    //Obtener Categoria por ID
    getById: async (id) => {
      const response = await api.get(`categories/${id}`);
      return response.data;
    },

    // Crear una nueva categoria
    create: async (data) => {
      const response = await api.post("categories/", data);
      return response.data;
    },

    // Actualizar una categoria
    update: async (id, data) => {
      const response = await api.put(`categories/${id}`, data);
      return response.data;
    },

    // Eliminar una categoria
    /* delete: async (id) => {
      const response = await api.delete(`categories/${id}`);
      return response.data;
    } */
  };
}