
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./theme-toggle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("md");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update navigation links to match the screenshot
  const navigationLinks = [
    { href: "/about-us", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/resources", label: "Resources" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b shadow-sm">
      <div className="container flex h-20 items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <Logo className="h-12 md:h-14 w-auto" />
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
          <nav className="hidden lg:flex gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-base font-medium transition-colors hover:text-primary relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          <Button variant="default" className="hidden lg:flex" asChild>
            <Link to="/contact">
              Request a Demo
            </Link>
          </Button>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px]">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the site.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <nav className="flex flex-col gap-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium py-2 px-4 hover:bg-accent rounded-md transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/contact"
                    className="text-lg font-medium bg-primary text-primary-foreground mt-2 py-2.5 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Request a Demo
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
