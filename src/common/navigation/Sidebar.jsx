import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/auth/AuthContext";
import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import ModeToggle from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import {
  ADMIN_ROLE,
  FACILITATOR_ROLE,
  SUPER_ADMIN_ROLE,
} from "@/constants/Constants";

function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        block w-full
        py-2
        text-sm font-medium text-left
        rounded-md
        hover:bg-accent hover:text-accent-foreground
      "
    >
      {children}
    </Link>
  );
}

export default function Sidebar({ onLinkClick }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFacilitator, setIsFacilitator] = useState(false);
  const { isAuthenticated, hasAnyRole, hasRole } = useAuth();
  useEffect(() => {
    console.log();
    if (hasAnyRole(ADMIN_ROLE, SUPER_ADMIN_ROLE)) {
      setIsAdmin(true);
    }
    if (hasRole(FACILITATOR_ROLE)) {
      setIsFacilitator(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col h-full">
      {/* NAV — no scroll */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <NavLink to="/chanting" onClick={onLinkClick}>
          Chanting
        </NavLink>
        <NavLink to="/dashboard" onClick={onLinkClick}>
          Chanting Analytics
        </NavLink>
        <NavLink to="/profile" onClick={onLinkClick}>
          Profile
        </NavLink>
        {isFacilitator && (
          <NavLink to="/facilitator" onClick={onLinkClick}>
            Facilitator
          </NavLink>
        )}
        {isAdmin && (
          <>
            <NavLink to="/admin" onClick={onLinkClick}>
              Admin
            </NavLink>
            <NavLink to="/audit" onClick={onLinkClick}>
              Admin Audit
            </NavLink>
          </>
        )}
      </nav>

      {/* PUSH FOOTER TO BOTTOM */}
      {isAuthenticated && (
        <div className="shrink-0">
          <Separator />
          <div className="px-2 py-3 flex items-center gap-2">
            <LogoutButton />
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
