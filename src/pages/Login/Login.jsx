import useSecureAxios from "@/common_components/hooks/useSecureAxios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState, createContext } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/auth/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const secureAxios = useSecureAxios();
  const { theme } = useTheme();
  const { login } = useAuth();

  const [googleTheme, setGoogleTheme] = useState("outline");

  useEffect(() => {
    if (theme === "dark") {
      setGoogleTheme("outline"); // dark-friendly
    } else {
      setGoogleTheme("filled_blue"); // light-friendly
    }
  }, [theme]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true); // ✅ block UI immediately

      const url = import.meta.env.VITE_BACKEND_BASE_URL + "/auth/google";

      const res = await secureAxios.post(
        url,
        { idToken: credentialResponse.credential },
        { withCredentials: true }
      );
      login(res?.data);

      navigate("/chanting", { replace: true }); // ✅ prevents back flicker
    } catch (error) {
      console.error("Google login failed", error);
      toast.error("Unauthorized user: " + error?.response?.data?.errorMessage);
      setIsLoading(false); // allow retry
    }
  };
  return (
    <div>
      {isLoading ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <Button disabled size="sm">
              <Spinner />
              Loading...
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <Card className=" w-1/2 mt-30">
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <GoogleLogin
                  theme={googleTheme}
                  onSuccess={handleGoogleSuccess}
                />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>
                  <Link to="/signup">Signup</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export const getAccessToken = () => accessToken;
