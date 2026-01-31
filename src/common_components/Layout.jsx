// Layout.jsx
import ModeToggle from "../components/mode-toggle";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import { Button } from "@/components/ui/button";

const authRoutes = ["/login", "/signup"];

export default function Layout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);
  const isSignupPage = location.pathname === "/signup";

  // AUTH PAGES → no sidebar layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {isSignupPage && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        <Outlet />
      </div>
    );
  }

  // APP PAGES → Navigation IS the layout
  return (
    <Navigation>
      <Outlet />
    </Navigation>
  );
}
