
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export function Header() {
  const [ctaText, setCtaText] = useState("Join the Waitlist");
  const [ctaTo, setCtaTo] = useState("#waitlist");
  const [isClient, setIsClient] = useState(false);

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
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-background/60 border-b border-border/40 backdrop-blur-lg">
      <div className="container flex items-center justify-between h-20">
        {/* Logo at top-left, larger sizing and always visible */}
        <Link
          to="/"
          className="flex items-center h-full group pl-1 pr-5"
          aria-label="Go to homepage"
          style={{ minHeight: "48px" }}
        >
          <Logo className="h-12 w-auto transition-all duration-150 group-hover:scale-105" />
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            to="/about-us"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="font-medium px-3 py-2 rounded hover:bg-accent text-base"
          >
            Contact
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
          {/* CTA button in top right */}
          <div className="flex items-center">
            <Button size="sm" asChild className="ml-2">
              {isClient && ctaTo.startsWith("/") ? (
                <Link to={ctaTo}>{ctaText}</Link>
              ) : (
                <a href={ctaTo}>{ctaText}</a>
              )}
            </Button>
            {/* Theme toggle, immediately to the right of CTA */}
            <span className="ml-1">
              <ThemeToggle />
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
