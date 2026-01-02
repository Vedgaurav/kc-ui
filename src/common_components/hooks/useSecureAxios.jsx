import axios from "axios";
import { BASE_URL } from "@/constants/Constants";

export default function useSecureAxios() {
  const api = axios.create({
    withCredentials: true,
  });

  axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        let url = BASE_URL + "/auth/refresh";
        await axios.post(url, {}, { withCredentials: true });
        return axios(err.config);
      }
      return Promise.reject(err);
    }
  );

  // api.interceptors.request.use((config) => {
  //   const token = getAccessToken();
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  //   return config;
  // });

  // api.interceptors.response.use(
  //   (res) => res,
  //   async (error) => {
  //     if (error.response?.status === 401) {
  //       let url = BASE_URL + "/auth/refresh";
  //       const res = await axios.post(url, {}, { withCredentials: true });
  //       let accessToken = res.data.accessToken;
  //       error.config.headers.Authorization = `Bearer ${accessToken}`;
  //       return axios(error.config);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  return api;
}
