import { api } from "../hooks/useAxiosData";

export function serviceService() {
  return {

     getAll: async () => {
      const response = await api.get("services");
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`services/${id}`);
      return response.data;
    },

    updateReview: async (id, reviewData) => {
      const response = await api.patch(`review/${id}`, reviewData);
      return response.data;
    },

    loadEvidence: async (id) => {
      const response = await api.get(`evidence/${id}`, {
        responseType: 'blob'  
      });
      return response;
    },
  };
}
