// Layout.jsx
import ModeToggle from "../components/mode-toggle";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import { Button } from "@/components/ui/button";

const authRoutes = ["/login", "/signup"];

export default function Layout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  // AUTH PAGES → no sidebar layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen relative">
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
