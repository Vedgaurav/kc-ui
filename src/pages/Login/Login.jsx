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
import ModeToggle from "@/components/mode-toggle";

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
      console.error("Google login failed", error);
      const data = error?.response?.data;
      toast.error(data?.errorMessage);
      setIsLoading(false);
    }
  };
  return (
    <div
      className="grid grid-cols-4 gap-2  text-center p-2 fixed bottom-0 left-0 w-full
    sm:static sm:mt-20"
    >
      {isLoading ? (
        <div className="col-span-2 col-start-2">
          <Button disabled size="sm">
            <Spinner />
            Loading...
          </Button>
        </div>
      ) : (
        <div className="col-span-4 sm:col-span-2 sm:col-start-2">
          <div className="flex justify-center items-center w-full">
            <img
              src={theme === "dark" ? "/darkmodelogo4.png" : "/rk.png"}
              alt="Sravan Kirtan"
              className="
                h-[68vh]
                sm:h-[70vh]
                w-auto
                object-contain
              "
            />
          </div>
          <div>
            <Card className="relative min-h-[25vh] sm:min-h-auto flex flex-col justify-center sm:max-w-md mx-auto border-0 bg-transparent">
              <CardContent className="flex flex-col items-center gap-4">
                {/* Toggle aligned to right */}
                <div className="w-full flex justify-end mb-10">
                  <ModeToggle />
                </div>

                {/* Google Button */}
                <div className="w-full max-w-sm">
                  <GoogleLogin
                    shape="circle"
                    size="large"
                    theme={googleTheme}
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
