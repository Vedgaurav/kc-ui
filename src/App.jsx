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
import Dashboard from "./pages/chanting/Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <div>Hello World</div> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: "/chanting", element: <Chanting /> },
            { path: "/profile", element: <Profile /> },
            { path: "/dashboard", element: <Dashboard /> },
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
