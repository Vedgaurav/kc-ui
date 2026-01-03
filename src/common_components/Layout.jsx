// Layout.jsx
import ModeToggle from "../components/mode-toggle";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { Button } from "@/components/ui/button";

const authRoutes = ["/login", "/signup"];

export default function Layout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);
  const isSignupPage = "/signup" === location.pathname;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Auth pages top-right controls */}
      {isAuthPage && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {isSignupPage && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      )}

      {/* App header */}
      {!isAuthPage && (
        <header className="border-b">
          <Navigation />
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
