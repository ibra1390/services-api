import { api } from "../hooks/useAxiosData";

export function roleService() {
  return {
    getAll: async () => {
      const response = await api.get("roles");
      return response.data;
    }
  };
}