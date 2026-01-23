import { toast } from "sonner";
import api from "./axios";

const BACKEND_URL_USER = "/api/users";

export function useUserApi() {
  const updateUser = async (data) => {
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

  const addUser = async (data) => {
    const url = BACKEND_URL_USER;

    try {
      const response = await api.post(url, data);
      // toast.success(`${response?.data?.email} User created`);
      toast.success(`User created`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage || "Failed to add user");
      throw error;
    }
  };

  const getUser = async () => {
    const url = BACKEND_URL_USER;

    try {
      const response = await api.get(url);
      // toast.success(`${response?.data?.email} user fetched`);
      return await response.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.errorMessage || "Failed to fetch user"
      );
      throw error;
    }
  };

  return { addUser, updateUser, getUser };
}
