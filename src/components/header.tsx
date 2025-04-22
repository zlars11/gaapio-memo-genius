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
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const location = useLocation();

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

    // NEW: Listen for admin toggle to show sign up or waitlist button
    const localStorageCtaCheck = () => {
      const cta = localStorage.getItem("homepageCta");
      setShowSignUp(cta === "signup");
    };
    localStorageCtaCheck();
    window.addEventListener("storage", localStorageCtaCheck);

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
      window.removeEventListener("storage", localStorageCtaCheck);
    };
  }, []);

  // Custom navigation link style
  const navLinkStyle = "text-sm font-medium transition-colors hover:text-foreground hover:border-b-2 hover:border-foreground/30 focus:outline-none";
  const activeNavLinkStyle = "border-b-2 border-primary font-semibold text-foreground";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      <div className="container flex items-center justify-between h-28 px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          aria-label="Gaapio Home"
        >
          <Logo className="h-28 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              <NavigationMenuItem>
                <Link 
                  to="/" 
                  className={cn(
                    navLinkStyle,
                    location.pathname === "/" && activeNavLinkStyle
                  )}
                  aria-current={location.pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-0 py-1">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4" role="menu">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/about-us"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        role="menuitem"
                      >
                        <div className="text-sm font-medium leading-none">About Us</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our mission and team
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/faq"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        role="menuitem"
                      >
                        <div className="text-sm font-medium leading-none">FAQ</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Frequently asked questions
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/ssa"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        role="menuitem"
                      >
                        <div className="text-sm font-medium leading-none">Subscription Agreement</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Our service terms and conditions
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link 
                  to="/blog" 
                  className={cn(
                    navLinkStyle,
                    location.pathname === "/blog" && activeNavLinkStyle
                  )}
                  aria-current={location.pathname === "/blog" ? "page" : undefined}
                >
                  Blog
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link 
                  to="/contact" 
                  className={cn(
                    navLinkStyle,
                    location.pathname === "/contact" && activeNavLinkStyle
                  )}
                  aria-current={location.pathname === "/contact" ? "page" : undefined}
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Button asChild>
            {showSignUp ? (
              <Link to="/signup">Sign Up Now</Link>
            ) : (
              <a href="#waitlist">Join Waitlist</a>
            )}
          </Button>
          <ThemeToggle />
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8" aria-label="Mobile Navigation">
                <Link
                  to="/"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors hover:text-primary",
                    location.pathname === "/" && "text-primary font-semibold border-l-4 border-primary pl-2"
                  )}
                  aria-current={location.pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
                <Link
                  to="/about-us"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors hover:text-primary",
                    location.pathname === "/about-us" && "text-primary font-semibold border-l-4 border-primary pl-2"
                  )}
                  aria-current={location.pathname === "/about-us" ? "page" : undefined}
                >
                  About Us
                </Link>
                <Link
                  to="/faq"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors hover:text-primary",
                    location.pathname === "/faq" && "text-primary font-semibold border-l-4 border-primary pl-2"
                  )}
                  aria-current={location.pathname === "/faq" ? "page" : undefined}
                >
                  FAQ
                </Link>
                <Link
                  to="/ssa"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors hover:text-primary",
                    location.pathname === "/ssa" && "text-primary font-semibold border-l-4 border-primary pl-2"
                  )}
                  aria-current={location.pathname === "/ssa" ? "page" : undefined}
                >
                  Subscription Agreement
                </Link>
                <Link
                  to="/blog"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors hover:text-primary",
                    location.pathname === "/blog" && "text-primary font-semibold border-l-4 border-primary pl-2"
                  )}
                  aria-current={location.pathname === "/blog" ? "page" : undefined}
                >
                  Blog
                </Link>
                <Link
                  to="/contact"
                  className={cn(
                    "text-lg font-medium py-2 transition-colors hover:text-primary",
                    location.pathname === "/contact" && "text-primary font-semibold border-l-4 border-primary pl-2"
                  )}
                  aria-current={location.pathname === "/contact" ? "page" : undefined}
                >
                  Contact
                </Link>
                <Button className="mt-4" asChild>
                  {showSignUp ? (
                    <Link to="/signup">Sign Up Now</Link>
                  ) : (
                    <a href="#waitlist">Join Waitlist</a>
                  )}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
