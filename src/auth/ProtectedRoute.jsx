import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute({ roles }) {
  const { userAuth, isAuthenticated, hasRole, userAuthLoading } = useAuth();
  const location = useLocation();
  if (userAuthLoading)
    return (
      <>
        <div className="flex flex-col items-center gap-4">
          <Button disabled size="sm">
            <Spinner />
            Loading...
          </Button>
        </div>
      </>
    );

  if (!isAuthenticated && !userAuthLoading) {
    console.log(
      "ProtectedRoute navigating to login isAuthenticated false ",
      userAuthLoading
    );
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some(hasRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (userAuth?.status === "INACTIVE" && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
