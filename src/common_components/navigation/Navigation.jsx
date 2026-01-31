import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Sidebar from "./Sidebar";
import { useAuth } from "@/auth/AuthContext";

export default function Navigation({ children }) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userAuth } = useAuth();

  return (
    <div className="flex h-screen">
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex border-r bg-background transition-all duration-300
          ${desktopOpen ? "w-64" : "w-0 overflow-hidden"}
        `}
      >
        {desktopOpen && (
          <div className="w-full h-full flex flex-col">
            <div className="mt-5">{userAuth.email}</div>
            {/* Sidebar top bar */}
            <div className="h-14 flex items-center justify-between border-b">
              <span className="font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDesktopOpen(false)}
              >
                <PanelLeftClose className="h-5 w-5" />
              </Button>
            </div>

            <Sidebar />
          </div>
        )}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-14 flex items-center gap-2 border-b shrink-0">
          {!desktopOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={() => setDesktopOpen(true)}
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          )}

          <span className="font-semibold ml-5">KC</span>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-1 overflow-auto">
          <div>{children}</div>
        </main>
        <footer className="h-14 flex items-center gap-2 border-b shrink-0">
          {/* Mobile */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 ml-3 mt-[60vh]">
              <div className="flex flex-col">
                <span className="font-semibold mt-5">{userAuth.email}</span>
                <span className="font-semibold mt-5">Menu</span>
              </div>
              <Sidebar onLinkClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <span className="font-semibold ml-5 sm:hidden">Menu</span>
        </footer>
      </div>
    </div>
  );
}
