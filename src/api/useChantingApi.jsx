import api from "@/api/axios";
import { toast } from "sonner";

const BACKEND_URL_USER = "/api/chanting";

export function useChantingApi() {
  const updateChanting = async (data) => {
    const url = BACKEND_URL_USER;

    try {
      const response = await api.put(url, data);
      toast.success(`User updated`);
      return response.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.errorMessage || "Failed to update user"
      );
      throw error;
    }
  };

  const addChanting = async (data) => {
    const url = BACKEND_URL_USER;

    try {
      const response = await api.post(url, data);
      toast.success(`User created`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage || "Failed to add user");
      throw error;
    }
  };

  const getChanting = async () => {
    const url = BACKEND_URL_USER;

    try {
      const response = await api.get(url);

      return await response.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.errorMessage || "Failed to fetch user"
      );
      throw error;
    }
  };

  const getFacilitatorGroupChantingToday = async (pagination) => {
    const url = `${BACKEND_URL_USER}/today`;

    try {
      const response = await api.get(url, {
        params: new URLSearchParams({ ...pagination }),
      });
      return response;
    } catch (error) {
      toast.error(
        error?.response?.data?.errorMessage || "Failed to fetch user"
      );
      throw error;
    }
  };

  return {
    addChanting,
    updateChanting,
    getChanting,
    getFacilitatorGroupChantingToday,
  };
}
