import useSecureAxios from "@/common_components/hooks/useSecureAxios";
import { toast } from "sonner";

const BACKEND_URL_USER = "/auth/user";

export function useAddUser() {
  const secureAxios = useSecureAxios();

  const addUser = async (data) => {
    const url = import.meta.env.VITE_BACKEND_BASE_URL + BACKEND_URL_USER;

    try {
      const response = await secureAxios.post(url, data);
      toast.success(`${response?.data?.email} user created`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage || "Failed to add user");
      throw error;
    }
  };

  return { addUser };
}
