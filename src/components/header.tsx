
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";

// Navigation links
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);
    const ctaSetting = localStorage.getItem("homepageCta");
    setShowSignUp(ctaSetting === "signup");

    // listen to localStorage changes from other tabs (e.g., toggle on admin)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "homepageCta") {
        setShowSignUp(e.newValue === "signup");
      }
    };
    window.addEventListener("storage", onStorage);

    // Listen for homepageCta changes on this tab as well
    const onLocalHomepageCta = () => {
      const updatedCta = localStorage.getItem("homepageCta");
      setShowSignUp(updatedCta === "signup");
    };

    window.addEventListener("focus", onLocalHomepageCta);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onLocalHomepageCta);
    };
  }, []);

  // Close menu on navigation change (mobile)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="mr-4 flex items-center space-x-2 font-semibold">
          <Logo className="h-8 w-auto" />
          <span className="sr-only">Gaapio</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-medium transition-colors hover:text-primary ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right-side CTA button */}
        <div className="flex items-center space-x-2">
          <Button size="sm" asChild>
            {isClient && showSignUp ? (
              <Link to="/signup">Sign Up Now</Link>
            ) : (
              <a href="#waitlist">Join Waitlist</a>
            )}
          </Button>

          {/* Mobile menu trigger */}
          <div className="ml-2 flex md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    <Logo className="h-8 w-auto" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-base font-medium py-1 transition-colors hover:text-primary ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <Button size="sm" className="w-full" asChild>
                      {isClient && showSignUp ? (
                        <Link to="/signup">Sign Up Now</Link>
                      ) : (
                        <a href="#waitlist">Join Waitlist</a>
                      )}
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
