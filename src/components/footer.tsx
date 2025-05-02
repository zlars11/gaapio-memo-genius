
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-background mt-24">
      {/* Main Footer Content */}
      <div className="container px-4 md:px-6 py-14 flex flex-col items-center">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center mb-10 max-w-lg">
          <Link to="/" className="inline-block mb-4">
            <Logo className="h-16 w-auto" />
          </Link>
          <p className="text-muted-foreground max-w-md text-center text-sm">
            Gaapio helps CPAs and finance teams write high-quality accounting memos
            in seconds with the power of AI.
          </p>
        </div>
        
        <Separator className="w-full max-w-4xl mb-8" />
        
        {/* Three Column Grid Layout - centered and with tighter spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-3xl mx-auto text-center">
          {/* Company Column */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about-us" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Demo
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources Column */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Status
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Report Issue
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect Column */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <Linkedin className="h-4 w-4" />
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  LinkedIn
                </Link>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <Twitter className="h-4 w-4" />
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <Youtube className="h-4 w-4" />
                <Link 
                  to="#" 
                  className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Legal Strip with improved spacing and alignment */}
      <div className="border-t border-border/50">
        <div className="container px-4 md:px-6 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} Gaapio. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0 md:space-x-4">
            <Link 
              to="#" 
              className="text-xs text-muted-foreground hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-3 hidden md:inline-block" />
            <Link 
              to="#" 
              className="text-xs text-muted-foreground hover:underline transition-colors"
            >
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-3 hidden md:inline-block" />
            <Link 
              to="#" 
              className="text-xs text-muted-foreground hover:underline transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
