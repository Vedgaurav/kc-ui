import axios from "axios";
import { API_URL } from "@/constants/Constants";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: import.meta.env.VITE_AXIOS_WITH_CREDENTIALS === "true",
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (
        originalRequest._retry ||
        error?.response?.data?.errorCode === "00001"
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
