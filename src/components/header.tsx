
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);

    // Check login status
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't show CTA on admin page
  const shouldShowCta = isClient && !isLoggedIn && !location.pathname.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-background/60 border-b border-border/40 backdrop-blur-lg">
      <div className="container flex items-center justify-between" style={{ height: "70px", padding: "0 1rem" }}>
        {/* Logo: left-most */}
        <Link
          to="/"
          className="flex items-center h-full group"
          aria-label="Go to homepage"
        >
          <Logo className="h-[60px] w-auto transition-all duration-150 group-hover:scale-105" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
          <Link
            to="/about-us"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            About Us
          </Link>
          <Link
            to="/pricing"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            Contact
          </Link>
          <Link
            to="/resources"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            Resources
          </Link>
          <Link
            to="/faq"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            FAQ
          </Link>
          <Link
            to="/blog"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            Blog
          </Link>
        </nav>

        {/* CTA + Theme toggle + Mobile Menu: right aligned */}
        <div className="flex items-center gap-2 lg:gap-4">
          {shouldShowCta && (
            <Button variant="default" asChild className="text-sm py-1 px-3 hidden sm:inline-flex">
              <Link to="/contact">Request a Demo</Link>
            </Button>
          )}
          {isClient && isLoggedIn && (
            <Button variant="outline" asChild className="text-sm py-1 px-3 hidden sm:inline-flex">
              <Link to="/" onClick={() => supabase.auth.signOut()}>Logout</Link>
            </Button>
          )}
          <ThemeToggle />
          {isClient && isLoggedIn && <AdminNavLink />}

          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/about-us"
                  className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/pricing"
                  className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/resources"
                  className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <Link
                  to="/faq"
                  className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  to="/blog"
                  className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                {shouldShowCta && (
                  <Button 
                    variant="default" 
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full mt-4"
                  >
                    <Link to="/contact">Request a Demo</Link>
                  </Button>
                )}
                {isClient && isLoggedIn && (
                  <Button 
                    variant="outline" 
                    asChild
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      supabase.auth.signOut();
                    }}
                    className="w-full"
                  >
                    <Link to="/">Logout</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
