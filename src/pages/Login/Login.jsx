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
    <div className="min-h-screen flex flex-col bg-black overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <Button disabled size="sm">
            <Spinner />
            Loading...
          </Button>
        </div>
      ) : (
        <>
          {/* 🔥 Logo Section (Takes remaining space) */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src={theme === "dark" ? "/darkmodelogo4.png" : "/rk.png"}
              alt="Sravan Kirtan"
              className="h-[65vh] max-h-[75vh] w-auto object-contain"
            />
          </div>

          {/* 🔥 Bottom Login Section */}
          <div className="pb-8 px-4">
            <div className="max-w-md mx-auto flex flex-col items-center gap-4">
              {/* Toggle */}
              <div className="w-full flex justify-end mb-10">
                <ModeToggle />
              </div>

              {/* Google Button */}
              <div className="w-full">
                <GoogleLogin
                  shape="circle"
                  size="large"
                  theme={googleTheme}
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google login failed")}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
