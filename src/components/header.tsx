import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="mr-4 flex items-center font-semibold">
          Gaapio
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
          <Button size="sm" asChild>
            {isClient && showSignUp ? (
              <Link to="/signup">Sign Up Now</Link>
            ) : (
              <a href="#waitlist">Join Waitlist</a>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
