
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Set initial states
    handleResize();
    handleScroll();

    // Add listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "About", href: "/about-us" },
    { name: "Resources", href: "/resources" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" }
  ];

  const isActive = (path: string) => {
    // Check if current path matches the nav link path
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm transition-all ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-14 w-auto" />
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-10 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-lg px-4 py-2 rounded-md transition-colors ${
                        isActive(link.href)
                          ? "font-semibold text-primary bg-primary/10"
                          : "text-foreground/70 hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-6 space-y-2">
                    <Button asChild className="w-full">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="flex gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 transition-colors relative ${
                    isActive(link.href)
                      ? "font-semibold text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive(link.href) && (
                    <span className="absolute inset-0 bg-primary/10 rounded-md"></span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
