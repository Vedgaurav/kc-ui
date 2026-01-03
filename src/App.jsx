import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Chanting from "./pages/chanting/Chanting";
import Profile from "./pages/profile/Profile";
import Layout from "./common_components/Layout";
import Signup from "./pages/Login/Signup";
import { Login } from "./pages/Login/Login";
import { Toaster } from "./components/ui/sonner";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <div>Hello World</div> },

        // PUBLIC
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },

        // PROTECTED routes
        {
          element: <ProtectedRoute />, // wrapper for all authenticated users
          children: [
            {
              path: "/chanting",
              element: <Chanting />,
              requiredRoles: ["USER", "ADMIN"], // optional roles
            },
            {
              path: "/profile",
              element: <Profile />,
              requiredRoles: ["USER", "ADMIN"],
            },
            {
              path: "/admin",
              element: (
                <ProtectedRoute requiredRoles={["ADMIN"]}>
                  <div>Admin Panel</div>
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster richColors position="top-right" className="text-left" />
      <div>
        <RouterProvider router={router}>
          <AuthProvider />
        </RouterProvider>
      </div>
    </div>
  );
}

export default App;
