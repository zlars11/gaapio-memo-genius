import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const { setTheme, theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = useCallback(() => {
    localStorage.setItem("admin_authenticated", "true");
    setIsAuthenticated(true);
    setIsAdmin(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("showMetricsOnHomepage");
  }, []);

  useEffect(() => {
    const storedAuth = localStorage.getItem("admin_authenticated");
    setIsAuthenticated(storedAuth === "true");
    setIsAdmin(storedAuth === "true");
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-background/60 border-b border-border/40 backdrop-blur-lg">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl">
          Gaapio
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            to="/about-us"
            className="font-medium px-3 py-2 rounded hover:bg-accent"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="font-medium px-3 py-2 rounded hover:bg-accent"
          >
            Contact
          </Link>
          <Link
            to="/faq"
            className="font-medium px-3 py-2 rounded hover:bg-accent"
          >
            FAQ
          </Link>
          <Link
            to="/blog"
            className="font-medium px-3 py-2 rounded hover:bg-accent"
          >
            Blog
          </Link>
          <Link
            to="/notes"
            className={`font-medium px-3 py-2 rounded ${useLocation().pathname === "/notes" ? "bg-accent" : ""}`}
          >
            Notes
          </Link>
          {isAdmin ? (
            <Link
              to="/admin"
              className="font-medium px-3 py-2 rounded hover:bg-accent"
            >
              Admin
            </Link>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!isAuthenticated ? (
            <Button size="sm" onClick={handleLogin}>
              Log In
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
