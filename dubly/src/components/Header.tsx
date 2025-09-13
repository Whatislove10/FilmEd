// src/components/Header.tsx

import { Link } from "react-router-dom";
import { Cog, Home, Medal, GraduationCap, User, Film, Info, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Создаем массив ссылок для удобного управления
const navLinks = [
  { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
  { href: "/challenges", label: "Challenges", icon: <Medal className="h-4 w-4" /> },
  { href: "/learn", label: "Learn", icon: <GraduationCap className="h-4 w-4" /> },
  { href: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { href: "/feed", label: "Feed", icon: <Film className="h-4 w-4" /> },
  { href: "/about", label: "About", icon: <Info className="h-4 w-4" /> },
  { href: "/team", label: "Team", icon: <Users className="h-4 w-4" /> },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Левая часть: Лого и название */}
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo_sample_hakathon_2.png" alt="Filmit Logo" className="h-6 w-auto" />
            <span className="font-bold">
              Filmit
            </span>
          </Link>
        </div>

        {/* Центральная часть: Навигация */}
        <div className="flex flex-1 items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link to={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
                      {link.icon}
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Правая часть: Профиль и настройки */}
        <div className="flex items-center justify-end space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Cog className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}