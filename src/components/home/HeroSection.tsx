
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedMemo } from "./AnimatedMemo";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const HeroSection = memo(function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const [enableSelfSignup, setEnableSelfSignup] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  useEffect(() => {
    // Add debugging information
    console.log("HeroSection: Initializing");
    
    try {
      setIsClient(true);
      console.log("HeroSection: Client-side rendering confirmed");
      
      // Load the self-signup setting
      const loadSelfSignupSetting = () => {
        try {
          const savedSetting = localStorage.getItem("enableSelfSignup");
          console.log("HeroSection: Self-signup setting loaded", savedSetting);
          setEnableSelfSignup(savedSetting !== null ? savedSetting === "true" : true);
        } catch (err) {
          console.error("HeroSection: Error loading self-signup setting", err);
          // Default to enabling in case of error
          setEnableSelfSignup(true);
        }
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
      setRenderError(error instanceof Error ? error.message : String(error));
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

  // Debugging UI if there's a render error
  if (renderError) {
    console.log("HeroSection: Rendering error UI");
    return (
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center pt-24 pb-12 dark:bg-background">
        <div className="container px-4 md:px-6 flex flex-col items-center">
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-400">
              Error Loading Hero Section
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {renderError}
            </p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      </section>
    );
  }

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
        
        {/* Animated memo display with error boundary */}
        <div className="flex justify-center items-center w-full mx-auto mb-8 overflow-visible">
          {isClient && (
            <ErrorBoundary fallback={
              <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 max-w-[900px] flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Demo visualization could not be loaded</p>
                  <p className="text-muted-foreground mb-4">This doesn't affect the core functionality of the site.</p>
                  <Button size="sm" onClick={() => window.location.reload()}>Reload</Button>
                </div>
              </div>
            }>
              <AnimatedMemo />
            </ErrorBoundary>
          )}
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
