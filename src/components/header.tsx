
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

export function Header() {
  const [ctaText, setCtaText] = useState("Join the Waitlist");
  const [ctaTo, setCtaTo] = useState("#waitlist");
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);
    
    // Check for CTA preference from localStorage
    const ctaSetting = localStorage.getItem("homepageCta");
    if (ctaSetting === "signup") {
      setCtaText("Sign Up Now");
      setCtaTo("/signup");
    } else {
      setCtaText("Join the Waitlist");
      setCtaTo("#waitlist");
    }

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
      <div className="container flex items-center justify-between" style={{ height: "110px" }}>
        {/* Logo: left-most, extra large */}
        <Link
          to="/"
          className="flex items-center h-full group pl-1 pr-7"
          aria-label="Go to homepage"
          style={{ minHeight: "100px" }}
        >
          <Logo className="h-[100px] w-auto transition-all duration-150 group-hover:scale-105" />
        </Link>
        <nav className="flex items-center space-x-7">
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
            Contact Us
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
          {/* CTA+Theme toggle: right aligned */}
          <div className="flex items-center ml-2 space-x-2">
            {shouldShowCta && (
              <Button size="sm" asChild className="ml-2 text-base py-2 px-5">
                <Link to={ctaTo}>{ctaText}</Link>
              </Button>
            )}
            {isClient && isLoggedIn && (
              <Button size="sm" asChild className="ml-2 text-base py-2 px-5">
                <Link to="/" onClick={() => supabase.auth.signOut()}>Logout</Link>
              </Button>
            )}
            <span>
              <ThemeToggle />
            </span>
            {isClient && isLoggedIn && <AdminNavLink />}
          </div>
        </nav>
      </div>
    </header>
  );
}
