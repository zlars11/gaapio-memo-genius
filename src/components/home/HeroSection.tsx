
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedMemo } from "./AnimatedMemo";

export const HeroSection = memo(function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const [enableSelfSignup, setEnableSelfSignup] = useState(true);
  
  useEffect(() => {
    try {
      setIsClient(true);
      
      // Load the self-signup setting
      const loadSelfSignupSetting = () => {
        const savedSetting = localStorage.getItem("enableSelfSignup");
        setEnableSelfSignup(savedSetting !== null ? savedSetting === "true" : true);
      };
      
      // Initial load
      loadSelfSignupSetting();
      
      // Listen for storage changes (in case admin updates in another tab)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "enableSelfSignup") {
          loadSelfSignupSetting();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch (error) {
      console.error("Error in HeroSection initialization:", error);
      // Default to enabling self-signup in case of error
      setIsClient(true);
      setEnableSelfSignup(true);
    }
  }, []);
  
  // Scroll to How It Works section when arrow is clicked
  const scrollToHowItWorks = () => {
    try {
      const howItWorksSection = document.getElementById('how-it-works');
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error scrolling to How It Works section:", error);
    }
  };

  // Determine secondary button text and link based on self-signup setting
  const secondaryButtonText = enableSelfSignup ? "Sign Up Now" : "Contact Sales";
  const secondaryButtonLink = enableSelfSignup ? "/signup" : "/contact";

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center pt-24 pb-12 dark:bg-background">
      {/* Hero content with improved spacing */}
      <div className="container px-4 md:px-6 flex flex-col items-center relative z-10">
        {/* Text content centered */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
            Audit Ready Memos and Disclosures
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
            AI-Powered. CPA-Approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" variant="blue" asChild>
              <Link to="/request-demo">Request a demo</Link>
            </Button>
            <Button size="lg" variant="blueOutline" asChild>
              <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
            </Button>
          </div>
        </div>
        
        {/* Animated memo display with wider sizing */}
        <div className="flex justify-center items-center w-full mx-auto mb-8 overflow-visible">
          {isClient && <AnimatedMemo />}
        </div>
      </div>
      
      {/* Down arrow for scrolling to How It Works section */}
      <div 
        className="animate-fade-up absolute bottom-6" 
        style={{ animationDelay: "400ms" }} 
        onClick={scrollToHowItWorks}
      >
        <ArrowDownCircle className="h-10 w-10 text-muted-foreground/50 dark:text-gray-400/70 animate-pulse-slow cursor-pointer" aria-hidden="true" />
      </div>
    </section>
  );
});
