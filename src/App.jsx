import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Chanting from "./pages/chanting/Chanting";
import Profile from "./pages/profile/Profile";
import Layout from "./common/Layout";
import { Login } from "./pages/Login/Login";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/chanting/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import RouteErrorBoundary from "./common/error/RouteErrorBoundary";
import { Facilitator } from "./pages/facilitator/Facilitator";
import { AdminAuditUser } from "./pages/admin/AdminAuditUsers";
import { FacilityDetails } from "./pages/facilitator/FacilityDetails";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        { path: "/login", element: <Login /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: "/", element: <div>Welcome to KC</div> },
            { path: "/chanting", element: <Chanting /> },
            { path: "/profile", element: <Profile /> },
            {
              path: "/dashboard",
              element: <Dashboard />,
            },
            { path: "/admin", element: <AdminUsers /> },
            { path: "/facilitator", element: <Facilitator /> },
            { path: "/audit", element: <AdminAuditUser /> },
            { path: "/facility", element: <FacilityDetails /> },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router}>
        <AuthProvider />
      </RouterProvider>
    </>
  );
}

export default App;
