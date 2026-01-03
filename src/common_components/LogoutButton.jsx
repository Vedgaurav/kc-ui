import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LogoutButton() {
  const { logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };
  const handleLogoutEverywhere = async () => {
    await logoutAll();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {" "}
          <Button variant="outline">Logout</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogoutEverywhere}>
            Logout Everywhere
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
