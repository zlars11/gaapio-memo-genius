
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Initialize dark mode state
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
    
    // Listen for changes in the color scheme
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches || document.documentElement.classList.contains("dark"));
    };
    
    darkModeQuery.addEventListener("change", handleChange);
    
    // Listen for changes to the dark class on the document
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-28 px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <Logo className="h-28 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#benefits"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Benefits
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <Button asChild>
            <a href="#waitlist">Join Waitlist</a>
          </Button>
          <ThemeToggle />
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <a
                  href="#how-it-works"
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#benefits"
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  Benefits
                </a>
                <a
                  href="#testimonials"
                  className="text-lg font-medium py-2 hover:text-primary transition-colors"
                >
                  Testimonials
                </a>
                <Button className="mt-4" asChild>
                  <a href="#waitlist">Join Waitlist</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
