import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ui/use-theme";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update navigation links to remove Pricing
  const navigationLinks = [
    { href: "/about-us", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="mr-4 flex items-center font-bold">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src="/gaapio-favicon-light-cropped.png" alt="Gaapio logo" />
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <span>Gaapio</span>
        </Link>
        <div className="mx-6 flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
          <nav className="hidden lg:flex gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sign In
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup">
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-2/3 md:w-1/2">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the site.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <nav className="flex flex-col gap-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    className="text-lg font-medium hover:underline underline-offset-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-lg font-medium hover:underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
