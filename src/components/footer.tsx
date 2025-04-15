import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-4">
              <picture>
                <source 
                  srcSet="/lovable-uploads/313c4648-d406-46d1-a3f7-429f3a8ea0e4.png" 
                  media="(prefers-color-scheme: dark)" 
                  width={500} 
                  height={125}
                />
                <source 
                  srcSet="/lovable-uploads/ce4eb84f-1d6e-4138-98c9-0c8b95e6797b.png" 
                  media="(prefers-color-scheme: light)" 
                  width={500} 
                  height={125}
                />
                <img
                  src="/lovable-uploads/ce4eb84f-1d6e-4138-98c9-0c8b95e6797b.png"
                  alt="Gaapio Logo"
                  width={500}
                  height={125}
                  className="h-24 w-auto"
                />
              </picture>
            </a>
            <p className="text-muted-foreground max-w-md">
              Gaapio helps CPAs and finance teams write high-quality accounting memos
              in seconds with the power of AI.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#how-it-works" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#benefits" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a 
                  href="#waitlist" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Join Waitlist
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Gaapio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
