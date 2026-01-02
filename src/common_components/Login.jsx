import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

let accessToken = null;

export function Login() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        let url = import.meta.env.VITE_BACKEND_BASE_URL + "/auth/google";
        console.log(
          "Google authenticated making backend call url ",
          url,
          credentialResponse
        );
        const res = await axios.post(
          url,
          { idToken: credentialResponse.credential },
          { withCredentials: true }
        );

        console.log("Backend authenticated ", res);
        accessToken = res.data.accessToken;
      }}
    />
  );
}

export const getAccessToken = () => accessToken;
