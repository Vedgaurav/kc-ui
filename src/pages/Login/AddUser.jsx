import api from "@/api/axios";
import { toast } from "sonner";

const BACKEND_URL_USER = "/auth/user";

export function useAddUser() {
  const addUser = async (data) => {
    const url = BACKEND_URL_USER;

    try {
      const response = await api.post(url, data);
      toast.success(`${response?.data?.email} user created`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage || "Failed to add user");
      throw error;
    }
  };

  return { addUser };
}
