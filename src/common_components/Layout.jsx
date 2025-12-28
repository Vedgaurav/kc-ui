// Layout.jsx

import ModeToggle from "../components/mode-toggle";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-4 border-b">
        <Navigation />
        <ModeToggle />
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
