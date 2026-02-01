import api from "@/api/axios";

export function useAdminUserApi() {
  const getUsers = async ({ search, page, size }) => {
    const { data } = await api.get("/api/admin/users", {
      params: { search, page, size },
    });
    return data;
  };

  const getAdminAuditHistory = async (params) => {
    const { data } = await api.get("/api/admin/users/audit", {
      params: new URLSearchParams({ ...params }),
    });
    return data;
  };

  const assignFacilitator = async (userIds) => {
    await api.post("/api/admin/users/assign-facilitator", { userIds });
  };

  const removeFacilitator = async (userIds) => {
    await api.post("/api/admin/users/remove-facilitator", { userIds });
  };

  const assignAdmin = async (userIds, role) => {
    await api.post("/api/admin/users/assign-admin", { userIds, role });
  };

  const removeAdmin = async (userIds) => {
    await api.post("/api/admin/users/remove-admin", { userIds });
  };
  return {
    getUsers,
    assignFacilitator,
    removeFacilitator,
    assignAdmin,
    removeAdmin,
    getAdminAuditHistory,
  };
}
