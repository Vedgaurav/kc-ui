import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/auth/AuthContext";
import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import ModeToggle from "@/components/mode-toggle";

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
  const { isAuthenticated } = useAuth();

  return (
    <div className="">
      {/* NAV — no scroll */}
      <nav className="flex flex-col  py-2 space-y-1">
        <NavLink to="/chanting" onClick={onLinkClick}>
          Chanting
        </NavLink>
        <NavLink to="/dashboard" onClick={onLinkClick}>
          Chanting Analytics
        </NavLink>
        <NavLink to="/profile" onClick={onLinkClick}>
          Profile
        </NavLink>
        <NavLink to="/admin" onClick={onLinkClick}>
          Admin
        </NavLink>
      </nav>

      {/* PUSH FOOTER TO BOTTOM */}
      {isAuthenticated && (
        <div className="mt-auto">
          <Separator />
          <div className=" py-3 flex items-center gap-2">
            <LogoutButton />
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
