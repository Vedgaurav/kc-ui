import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/auth/AuthContext";
import ModeToggle from "../components/mode-toggle";

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full flex items-center px-4 h-14">
      <NavigationMenu>
        <div className="flex gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/chanting">Chanting</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/profile">Profile</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </NavigationMenu>

      {isAuthenticated && (
        <div className="ml-auto flex items-center gap-2">
          <LogoutButton />
          <ModeToggle />
        </div>
      )}
    </div>
  );
}
