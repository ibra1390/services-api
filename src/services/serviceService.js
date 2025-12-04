import { api } from "../hooks/useAxiosData";

export function serviceService() {
  return {
    getById: async (id) => {
      const response = await api.get(`services/${id}`);
      return response.data;
    },
  };
}
