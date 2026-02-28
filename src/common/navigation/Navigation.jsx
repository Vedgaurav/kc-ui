import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
            <div className="mt-5 px-3 text-sm text-muted-foreground">
              {userAuth?.email}
            </div>

            {/* Top bar */}
            <div className="h-14 flex items-center justify-between border-b px-3">
              <span className="font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDesktopOpen(false)}
              >
                <PanelLeftClose className="h-5 w-5" />
              </Button>
            </div>

            {/* THIS must be flex-1 */}
            <div className="flex-1 overflow-hidden">
              <Sidebar setMobileOpen={() => {}} />
            </div>
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
        <footer className="h-14 flex items-center justify-end gap-2 border-b shrink-0">
          {/* Mobile */}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <span className="font-semibold  sm:hidden">Menu</span>
                <Menu className="h-6 w-6 mr-12" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64 h-full p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Mobile Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="h-full flex flex-col">
                {/* TOP HEADER */}
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    {userAuth?.email}
                  </span>
                </div>

                {/* PUSH MENU TO BOTTOM */}
                <div className="flex-1 flex flex-col justify-end overflow-hidden">
                  <div className="pb-4">
                    <div className="px-2 text-sm font-semibold border-b pb-3">
                      <span className="font-semibold text-sm ">Menu</span>
                    </div>

                    {/* Sidebar lives here */}
                    <div className="max-h-[60vh] overflow-y-auto">
                      <Sidebar
                        onLinkClick={() => setMobileOpen(false)}
                        setMobileOpen={setMobileOpen}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </footer>
      </div>
    </div>
  );
}
