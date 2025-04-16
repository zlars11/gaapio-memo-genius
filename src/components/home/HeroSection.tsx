
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize based on system/user preference
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

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative hero-glow">
      {/* Background Memo Image - More Transparent */}
      <div className="absolute top-[45%] right-0 transform -translate-y-1/4 opacity-5 z-0 pointer-events-none">
        <img 
          src={isDark ? "/lovable-uploads/01273276-ea88-43e0-9d91-0cb238f997be.png" : "/lovable-uploads/e13abd02-7766-469a-af2d-18a152812501.png"} 
          alt="ASC 606 Memo" 
          className="w-[800px] h-auto rotate-6"
        />
      </div>
      
      <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
          Accounting Memos in Seconds
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl animate-fade-up" style={{ animationDelay: "100ms" }}>
          AI-Powered. CPA-Approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Button size="lg" asChild>
            <a href="#waitlist">Join the Waitlist</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#how-it-works">See How It Works</a>
          </Button>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
          <ArrowDownCircle className="h-10 w-10 text-muted-foreground/50 animate-pulse-slow" />
        </div>
      </div>
    </section>
  );
}
