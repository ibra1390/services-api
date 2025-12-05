// services/authService.js
import axios from "axios";

export const authService = {
  getProfile: () => axios.get("https://www.hs-service.api.crealape.com/api/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }),
};
