import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chanting from "./pages/chanting/Chanting";
import Profile from "./pages/profile/Profile";
import ModeToggle from "./components/mode-toggle";
import Layout from "./common_components/Layout";
import Signup from "./pages/Login/Signup";
import { Login } from "./common_components/Login";
import { Toaster } from "./components/ui/sonner";
function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <div>Hello World</div> },
        { path: "/chanting", element: <Chanting /> },
        { path: "/profile", element: <Profile /> },
        { path: "/signup", element: <Signup /> },
        { path: "/login", element: <Login /> },
      ],
    },
  ]);

  return (
    <div className="relative min-h-screen">
      {/* Top-right toggle */}

      {/* <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div> */}

      {/* Router content */}
      <Toaster richColors position="top-right" className="text-left" />
      <div className="p-6">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
