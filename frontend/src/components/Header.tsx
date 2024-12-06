import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { SiEventbrite } from "react-icons/si";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Logo = () => {
  return (
    <div className="flex items-center">
      <SiEventbrite size={36} />
      <Link to="/">
        <span className="ml-1 font-bold text-3xl italic">VENTFUL</span>
      </Link>
    </div>
  );
};

export function Header() {
  const { role, logout } = useAuth();

  return (
    <nav className="h-16 flex justify-between items-center px-4 py-1 shadow-xl">
      <Logo />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar.jpg" alt="@shadcn" />
              <AvatarFallback>{role === "ADMIN" ? "A" : "M"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">username</p>
              <p className="text-xs leading-none text-muted-foreground">
                email@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>
                <FaRegUser />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
            <DropdownMenuShortcut>
              <LuLogOut />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
