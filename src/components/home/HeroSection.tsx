
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";

export const HeroSection = memo(function HeroSection() {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're in the client environment
    setIsClient(true);
    
    // Initialize based on system/user preference for dark mode
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
    
    // Listen for changes in the color scheme and theme toggle
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
    
    // Additional listener for theme toggle changes
    const handleStorageEvent = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Scroll to How It Works section when arrow is clicked
  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative hero-glow">
      {/* Background Memo Image - Updated with new images */}
      <div className="absolute top-[45%] right-0 transform -translate-y-1/4 opacity-[0.15] z-0 pointer-events-none" aria-hidden="true">
        <img 
          src={isDark ? "/lovable-uploads/fdd4547f-fc69-4362-a29f-693e850e043c.png" : "/lovable-uploads/87623a0a-f991-495f-9403-a577f9e5ee2a.png"} 
          alt="" 
          className="w-[800px] h-auto rotate-6"
          width={800}
          height={1000}
          loading="eager"
          decoding="async"
        />
      </div>
      
      <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
          CPA Trusted Accounting Memos in Seconds
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl animate-fade-up" style={{ animationDelay: "100ms" }}>
          AI-Powered. CPA-Approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
          {/* Swapped button styles: Request demo now black, Sign Up white with border */}
          <Button size="lg" variant="default" asChild>
            <Link to="/contact">Request a demo</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "300ms" }} onClick={scrollToHowItWorks}>
          <ArrowDownCircle className="h-10 w-10 text-muted-foreground/50 animate-pulse-slow cursor-pointer" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
});
