import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Logo } from "@/components/logo";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [enableSelfSignup, setEnableSelfSignup] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const savedSetting = localStorage.getItem("enableSelfSignup");
    setEnableSelfSignup(savedSetting !== null ? savedSetting === "true" : true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "enableSelfSignup") {
        const newSetting = e.newValue !== null ? e.newValue === "true" : true;
        setEnableSelfSignup(newSetting);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMenu}>
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation - Right Aligned */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-4">
                {/* Products Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="font-medium text-base text-gray-700 dark:text-gray-200 px-3 py-2 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors focus:outline-none focus:ring-0 focus:border-none"
                >
                  Products
                </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <div className="grid gap-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/accounting-memos"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Accounting Memos</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              AI-powered technical accounting memos
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/footnote-disclosures"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Footnote Disclosures</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Comprehensive audit-ready disclosures
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/guidance-updates"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Guidance Updates</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Real-time accounting standard alerts
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other Navigation Items */}
                <NavigationMenuItem>
                  <Link 
                    to="/about-us" 
                    className="text-gray-700 dark:text-gray-200 font-medium hover:text-gray-900 dark:hover:text-white hover:underline transition-colors px-3 py-2"
                  >
                    About
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/resources" 
                    className="text-gray-700 dark:text-gray-200 font-medium hover:text-gray-900 dark:hover:text-white hover:underline transition-colors px-3 py-2"
                  >
                    Resources
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/faq" 
                    className="text-gray-700 dark:text-gray-200 font-medium hover:text-gray-900 dark:hover:text-white hover:underline transition-colors px-3 py-2"
                  >
                    FAQ
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/contact" 
                    className="text-gray-700 dark:text-gray-200 font-medium hover:text-gray-900 dark:hover:text-white hover:underline transition-colors px-3 py-2"
                  >
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 ml-6">
              <ModeToggle />
              <Button variant="blue" asChild>
                <Link to="/request-demo">Request a Demo</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <Link
                to="/accounting-memos"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/accounting-memos') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                Accounting Memos
              </Link>
              <Link
                to="/footnote-disclosures"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/footnote-disclosures') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                Footnote Disclosures
              </Link>
              <Link
                to="/guidance-updates"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/guidance-updates') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                Guidance Updates
              </Link>
              <Link
                to="/about-us"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/about-us') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                to="/resources"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/resources') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                Resources
              </Link>
              <Link
                to="/faq"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/faq') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/contact') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                onClick={closeMenu}
              >
                Contact
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="mt-3 px-3">
                  <Button variant="blue" asChild className="w-full">
                    <Link to="/request-demo" onClick={closeMenu}>Request a Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
