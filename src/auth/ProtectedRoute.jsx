import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ADMIN_ROLE,
  FACILITATOR_ROLE,
  SUPER_ADMIN_ROLE,
} from "@/constants/Constants";

export default function ProtectedRoute() {
  const {
    userAuth,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    roles,
    userAuthLoading,
  } = useAuth();
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

  if (userAuth?.status === "INACTIVE" && location.pathname !== "/signup") {
    return <Navigate to="/signup" replace />;
  }

  if (
    !hasAnyRole(FACILITATOR_ROLE, ADMIN_ROLE, SUPER_ADMIN_ROLE) &&
    (location.pathname === "/facilitator" || location.pathname === "/facility")
  ) {
    return <Navigate to="/chanting" replace />;
  }

  if (!hasAnyRole(SUPER_ADMIN_ROLE) && location.pathname === "/audit") {
    return <Navigate to="/chanting" replace />;
  }

  if (
    !hasAnyRole(ADMIN_ROLE, SUPER_ADMIN_ROLE) &&
    location.pathname === "/admin"
  ) {
    return <Navigate to="/chanting" replace />;
  }
  if (location.pathname === "/signup" && userAuth?.status === "ACTIVE") {
    return <Navigate to="/chanting" replace />;
  }
  return <Outlet />;
}
