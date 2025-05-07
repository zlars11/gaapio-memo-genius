
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

export function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between" style={{ minHeight: "110px", paddingTop: "5px", paddingBottom: "5px" }}>
        {/* Logo: left-most, extra large */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to="/"
            className="flex items-center h-full group pl-1 pr-7"
            aria-label="Go to homepage"
          >
            <Logo className="h-[100px] w-auto transition-all duration-150 group-hover:scale-105" />
          </Link>
          
          {/* Mobile menu toggle could go here */}
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:space-x-7 w-full md:w-auto space-y-4 md:space-y-0 py-4 md:py-0">
          <nav className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-0 md:space-x-7">
            <Link
              to="/about-us"
              className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
            >
              Contact
            </Link>
            <Link
              to="/resources"
              className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
            >
              Resources
            </Link>
            <Link
              to="/faq"
              className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
            >
              FAQ
            </Link>
            <Link
              to="/blog"
              className="font-medium px-4 py-2 rounded hover:bg-accent text-lg"
            >
              Blog
            </Link>
          </nav>
          
          {/* CTA+Theme toggle: right aligned */}
          <div className="flex items-center justify-center md:justify-end gap-4 ml-0 md:ml-auto">
            {shouldShowCta && (
              <Button variant="default" asChild className="text-base py-2 px-5">
                <Link to="/contact">Request a Demo</Link>
              </Button>
            )}
            {isClient && isLoggedIn && (
              <Button asChild className="text-base py-2 px-5">
                <Link to="/" onClick={() => supabase.auth.signOut()}>Logout</Link>
              </Button>
            )}
            <ThemeToggle />
            {isClient && isLoggedIn && <AdminNavLink />}
          </div>
        </div>
      </div>
    </header>
  );
}
