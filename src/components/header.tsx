
import { useState, useEffect, useCallback } from "react";
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
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const location = useLocation();
  // For CTA button (Join the Waitlist or Sign Up Now)
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
          {/* Removed Notes and Admin tab */}
          {/* Theme Toggle */}
          <ThemeToggle />
          {/* Restore CTA button in top right */}
          <Button
            size="sm"
            asChild
            className="ml-2"
          >
            {isClient && ctaTo.startsWith("/") ? (
              <Link to={ctaTo}>{ctaText}</Link>
            ) : (
              <a href={ctaTo}>{ctaText}</a>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
