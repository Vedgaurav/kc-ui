import useSecureAxios from "@/common_components/hooks/useSecureAxios";
import { toast } from "sonner";

const BACKEND_URL_USER = "/api/chanting";

export function useChantingApi() {
  const secureAxios = useSecureAxios();

  const updateChanting = async (data) => {
    const url = import.meta.env.VITE_BACKEND_BASE_URL + BACKEND_URL_USER;

    try {
      const response = await secureAxios.put(url, data);
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
    const url = import.meta.env.VITE_BACKEND_BASE_URL + BACKEND_URL_USER;

    try {
      const response = await secureAxios.post(url, data);
      // toast.success(`${response?.data?.email} User created`);
      toast.success(`User created`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage || "Failed to add user");
      throw error;
    }
  };

  const getChanting = async () => {
    const url = import.meta.env.VITE_BACKEND_BASE_URL + BACKEND_URL_USER;

    try {
      const response = await secureAxios.get(url);
      // toast.success(`${response?.data?.email} user fetched`);
      return await response.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.errorMessage || "Failed to fetch user"
      );
      throw error;
    }
  };

  return { addChanting, updateChanting, getChanting };
}
