
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Set initial states
    handleResize();
    handleScroll();

    // Add listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const productLinks = [
    { name: "Accounting Memos", href: "/accounting-memos", description: "AI-powered technical accounting memos" },
    { name: "Footnote Disclosures", href: "/footnote-disclosures", description: "Comprehensive footnote disclosures" },
    { name: "Guidance Updates and Education", href: "/guidance-updates", description: "Stay current with guidance updates" }
  ];

  const navLinks = [
    { name: "About", href: "/about-us" },
    { name: "Resources", href: "/resources" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isProductActive = () => {
    return productLinks.some(link => location.pathname === link.href);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm transition-all ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center"
          aria-label="Gaapio Homepage"
          style={{ height: '100%' }}
        >
          <Logo />
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <AdminNavLink />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-10 flex flex-col gap-4">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Products</p>
                    {productLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`text-sm px-4 py-2 rounded-md transition-colors block ${
                          isActive(link.href)
                            ? "font-semibold text-primary bg-primary/10"
                            : "text-foreground/70 hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-lg px-4 py-2 rounded-md transition-colors ${
                        isActive(link.href)
                          ? "font-semibold text-primary bg-primary/10"
                          : "text-foreground/70 hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-6 space-y-2">
                    <Button asChild className="w-full" variant="blue">
                      <Link to="/request-demo">Request a Demo</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="flex gap-1 items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={`px-3 py-2 transition-colors relative text-foreground/70 hover:text-foreground font-normal ${
                      isProductActive()
                        ? "font-semibold text-primary"
                        : ""
                    }`}>
                      <span className="relative z-10">Products</span>
                      {isProductActive() && (
                        <span className="absolute inset-0 bg-primary/10 rounded-md"></span>
                      )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[480px] p-1 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border/20 shadow-2xl rounded-xl">
                        {productLinks.map((link, index) => (
                          <div key={link.href}>
                            <NavigationMenuLink key={link.href} asChild>
                              <Link
                                to={link.href}
                                className="group block select-none rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/50 hover:shadow-sm focus:bg-accent focus:text-accent-foreground active:scale-[0.98]"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="text-base font-semibold leading-none text-foreground group-hover:text-primary transition-colors duration-200">{link.name}</div>
                                    <p className="mt-2 text-xs leading-snug text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-200">
                                      {link.description}
                                    </p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                </div>
                              </Link>
                            </NavigationMenuLink>
                            {index < productLinks.length - 1 && (
                              <div className="mx-4 h-px bg-border/30"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 transition-colors relative text-foreground/70 hover:text-foreground font-normal ${
                    isActive(link.href)
                      ? "font-semibold text-primary"
                      : ""
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive(link.href) && (
                    <span className="absolute inset-0 bg-primary/10 rounded-md"></span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <AdminNavLink />
              <ModeToggle />
              <Button asChild variant="blue">
                <Link to="/request-demo">Request a Demo</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
