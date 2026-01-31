import api from "@/api/axios";

export function useAdminUserApi() {
  const getUsers = async ({ search, page, size }) => {
    const { data } = await api.get("/api/admin/users", {
      params: { search, page, size },
    });
    return data;
  };

  const assignFacilitator = async (userIds) => {
    await api.post("/api/admin/users/assign-facilitator", { userIds });
  };

  const removeFacilitator = async (userIds) => {
    await api.post("/api/admin/users/remove-facilitator", { userIds });
  };

  return { getUsers, assignFacilitator, removeFacilitator };
}
