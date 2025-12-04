import axios from "axios";

export const schoolService = () => {
  const API = "https://www.hs-service.api.crealape.com/api/v1/schools/";

  return {
    getAll: async () => (await axios.get(API)).data,
    create: async (data) => (await axios.post(API, data)).data,
    update: async (id, data) => (await axios.put(`${API}${id}`, data)).data
  };
};
