import api from "./axios";

const FACILITATORS_API = "/api/facilitator";

export function useFacilitatorApi() {
  const getFacilitators = async () => {
    try {
      const response = await api.get(FACILITATORS_API);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.errorMessage || "Facilitator fetch failed"
      );
    }
  };

  const getFacilitatorUsers = async (params) => {
    const url = `${FACILITATORS_API}/users`;
    const { data } = await api.get(url, {
      params: new URLSearchParams({ ...params }),
    });
    return data;
  };

  const getFacilitatorUserChantingDetails = async (userId, pagination) => {
    const url = `${FACILITATORS_API}/user/${userId}`;
    const { data } = await api.get(url, {
      params: new URLSearchParams({ ...pagination }),
    });
    return data;
  };

  const getFacilitatorUserAnalytics = async (userId, pagination) => {
    const url = `${FACILITATORS_API}/user/analytics/{userId}`;
    const { data } = await api.get(url, {
      params: new URLSearchParams({ ...pagination }),
    });
    return data;
  };

  return {
    getFacilitators,
    getFacilitatorUsers,
    getFacilitatorUserChantingDetails,
    getFacilitatorUserAnalytics,
  };
}

//   const updateFacilitator = async (data) => {
//     const url = BACKEND_URL_USER;

//     try {
//       const response = await api.put(url, data);
//       toast.success(`User updated`);
//       return response.data;
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.errorMessage || "Failed to update user"
//       );
//       throw error;
//     }
//   };

//   const addFacilitator = async (data) => {
//     const url = BACKEND_URL_USER;

//     try {
//       const response = await api.post(url, data);
//       // toast.success(`${response?.data?.email} User created`);
//       toast.success(`User created`);
//       return response.data;
//     } catch (error) {
//       toast.error(error?.response?.data?.errorMessage || "Failed to add user");
//       throw error;
//     }
//   };
