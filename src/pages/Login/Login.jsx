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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/auth/AuthContext";
import api from "@/api/axios";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { login, isAuthenticated, userAuthLoading } = useAuth();

  const [googleTheme, setGoogleTheme] = useState("outline");

  useEffect(() => {
    if (theme === "dark") {
      setGoogleTheme("outline");
    } else {
      setGoogleTheme("filled_blue");
    }
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated && !userAuthLoading) {
      console.log("Login Successfull navigating now");

      navigate("/chanting", { replace: true });
    }
  }, [isAuthenticated, userAuthLoading]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);

      if (!isAuthenticated) {
        const url = "/auth/google";

        const res = await api.post(
          url,
          { idToken: credentialResponse.credential },
          { withCredentials: true }
        );

        console.log("Google login response");
        login(res?.data?.userDto);
      }
    } catch (error) {
      console.error("Google login failed Ved", error);
      const data = error?.response?.data;
      toast.error(data?.errorMessage);
      setIsLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-4 gap-2 mt-20">
      {isLoading ? (
        <div className="col-span-2 col-start-2">
          <Button disabled size="sm">
            <Spinner />
            Loading...
          </Button>
        </div>
      ) : (
        <div className="col-span-4 sm:col-span-2 sm:col-start-2">
          <Card className="min-h-[30vh] sm:min-h-auto flex flex-col justify-center sm:max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-center">
              <div className="w-full max-w-2xs sm:max-w-sm">
                <GoogleLogin
                  shape="circle"
                  size="large"
                  width="99%"
                  theme={googleTheme}
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google login failed")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
