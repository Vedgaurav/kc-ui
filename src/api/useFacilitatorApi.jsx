import api from "./axios";

const FACILITATORS_API = "/api/facilitators";

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

  return { getFacilitators };
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
