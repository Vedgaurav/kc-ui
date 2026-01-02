import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/auth/AuthContext";

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full flex items-center">
      <NavigationMenu>
        <div className="flex gap-2">
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

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/signup">Signup</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {!isAuthenticated && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </div>
      </NavigationMenu>

      {isAuthenticated && (
        <div className="ml-auto mr-2">
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
