import axios from "axios";
import { BASE_URL } from "@/constants/Constants";
import { emitAuthExpired } from "@/auth/authEvent";

export default function useSecureAxios() {
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: import.meta.env.VITE_AXIOS_WITH_CREDENTIALS === "true",
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401) {
        if (originalRequest._retry) {
          emitAuthExpired();
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          return api(originalRequest);
        } catch (refreshError) {
          emitAuthExpired();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
