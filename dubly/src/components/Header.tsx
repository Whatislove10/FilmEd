import { Link, NavLink } from "react-router-dom";
import { Cog, Home, Menu, Medal, GraduationCap, User, Film, Info, Users } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/challenges", label: "Challenges", icon: <Medal className="h-5 w-5" /> },
  { href: "/learn", label: "Learn", icon: <GraduationCap className="h-5 w-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  { href: "/feed", label: "Feed", icon: <Film className="h-5 w-5" /> },
  { href: "/about", label: "About", icon: <Info className="h-5 w-5" /> },
  { href: "/team", label: "Team", icon: <Users className="h-5 w-5" /> },
];

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        
        {/* --- ИЗМЕНЕНИЕ: Возвращаем ваше лого --- */}
        <Link to="/" className="mr-auto flex items-center space-x-2">
          <img src="/logo_sample_hakathon_2.png" alt="Filmit Logo" className="h-8 w-auto" />
          <span className="font-bold hidden sm:inline-block">Filmit</span>
        </Link>

        {/* Навигация для десктопа - по центру и скрыта на мобильных */}
        <nav className="hidden md:flex mx-auto">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to={link.href} 
                      className={({ isActive }) => 
                        `group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                          isActive ? "bg-accent" : "bg-transparent"
                        }`
                      }
                    >
                      {link.icon}
                      <span className="hidden lg:inline">{link.label}</span>
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Иконки справа */}
        <div className="flex items-center space-x-2 ml-auto">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><Cog className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Кнопка "бургер" для мобильного меню */}
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <NavLink 
                    key={`mobile-${link.href}`} 
                    to={link.href} 
                    onClick={() => setSheetOpen(false)} 
                    className={({ isActive }) => 
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-lg transition-all ${
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-primary"
                      }`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}