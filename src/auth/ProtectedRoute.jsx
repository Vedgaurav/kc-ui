import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading)
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some(hasRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
