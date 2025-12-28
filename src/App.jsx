import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chanting from "./pages/chanting/Chanting";
import Profile from "./pages/profile/Profile";
import ModeToggle from "./components/mode-toggle";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello World</div>,
    },
    {
      path: "/chanting",
      element: <Chanting />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);

  return (
    <div className="relative min-h-screen">
      {/* Top-right toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* Router content */}
      <div className="p-6">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
