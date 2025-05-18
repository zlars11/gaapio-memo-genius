
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Helper function to safely access localStorage
const safeLocalStorageGet = (key: string, defaultValue: string): string => {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error accessing localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting localStorage for key "${key}":`, error);
    // Show a toast notification for storage errors
    toast({
      title: "Storage Error",
      description: "Could not save settings. Some features may be limited.",
      variant: "destructive",
    });
  }
};

// Helper to safely parse JSON
const safeJsonParse = (json: string | null, fallback: any[] = []): any[] => {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
};

export default function Index() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    contactCount: 0,
    userCount: 0
  });
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [initComplete, setInitComplete] = useState(false);

  useEffect(() => {
    // Add debugging console message
    console.log("Index page initializing...");
    
    try {
      // Mark that we're in the client environment
      setIsClient(true);
      console.log("Client-side rendering confirmed");
      
      // Initialize dark mode detection
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
      console.log("Dark mode status:", isDark);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches || document.documentElement.classList.contains("dark"));
      };
      
      darkModeQuery.addEventListener("change", handleChange);
      
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      
      const handleStorageEvent = () => {
        setIsDark(document.documentElement.classList.contains("dark"));
      };
      
      window.addEventListener('storage', handleStorageEvent);
      
      // Check if metrics should be displayed
      const shouldShowMetrics = safeLocalStorageGet("showMetricsOnHomepage", "false") === "true";
      const isAdmin = safeLocalStorageGet("admin_authenticated", "false") === "true";
      
      setShowMetrics(shouldShowMetrics && isAdmin);
      console.log("Metrics display:", { shouldShowMetrics, isAdmin });
      
      if (shouldShowMetrics && isAdmin) {
        // Load metrics data
        try {
          const contactData = safeJsonParse(localStorage.getItem("contactSubmissions"));
          const userData = safeJsonParse(localStorage.getItem("userSignups"));
          
          setMetrics({
            contactCount: contactData.length,
            userCount: userData.length
          });
          console.log("Metrics loaded:", { contacts: contactData.length, users: userData.length });
        } catch (error) {
          console.error("Error loading metrics data:", error);
          // Fallback to default values if there's an error
          setMetrics({
            contactCount: 0,
            userCount: 0
          });
        }
      }
      
      // Initialize self-signup setting if not set
      if (localStorage.getItem("enableSelfSignup") === null) {
        safeLocalStorageSet("enableSelfSignup", "true");
        console.log("Self-signup setting initialized to true");
      }
      
      // Set homepageCta based on the self-signup setting
      const enableSelfSignup = safeLocalStorageGet("enableSelfSignup", "true") !== "false";
      safeLocalStorageSet("homepageCta", enableSelfSignup ? "signup" : "contact");
      console.log("Homepage CTA set to:", enableSelfSignup ? "signup" : "contact");

      // Initialize password protection settings if not already set
      if (localStorage.getItem("password_protection_enabled") === null) {
        safeLocalStorageSet("password_protection_enabled", "false");
        console.log("Password protection initialized to false");
      }
      
      // Use environment variable for site password
      try {
        // Safely try to access the environment variable
        let defaultPassword = "";
        try {
          if (import.meta.env && import.meta.env.VITE_SITE_PASSWORD) {
            defaultPassword = import.meta.env.VITE_SITE_PASSWORD;
            console.log("Site password found in environment variables");
          } else {
            console.log("No site password found in environment variables");
          }
        } catch (envError) {
          console.warn("Error accessing environment variables:", envError);
          // Continue execution, we'll use empty string as default
        }
        
        if (localStorage.getItem("site_password") === null && defaultPassword) {
          safeLocalStorageSet("site_password", defaultPassword);
          console.log("Site password initialized from environment variable");
        } else if (localStorage.getItem("site_password") === null) {
          // If no env variable and no existing password, set an empty string
          // This will require admins to set a password
          safeLocalStorageSet("site_password", "");
          console.log("Site password initialized to empty string");
        }
      } catch (error) {
        console.error("Error setting up password from environment:", error);
        // If environment variable access fails, ensure we have a default
        if (localStorage.getItem("site_password") === null) {
          safeLocalStorageSet("site_password", "");
          console.log("Site password fallback to empty string after error");
        }
      }
      
      if (localStorage.getItem("session_version") === null) {
        safeLocalStorageSet("session_version", "0");
        console.log("Session version initialized to 0");
      }
      
      setInitComplete(true);
      console.log("Index page initialization complete");

      return () => {
        darkModeQuery.removeEventListener("change", handleChange);
        observer.disconnect();
        window.removeEventListener('storage', handleStorageEvent);
      };
    } catch (error) {
      console.error("Error in Index page initialization:", error);
      setInitError(error instanceof Error ? error.message : String(error));
      // Ensure we're marked as client-side even if there's an error
      setIsClient(true);
      setInitComplete(true);
      // Show toast notification for initialization error
      toast({
        title: "Initialization Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  }, []);
  
  // Show initialization error if one occurred
  if (initError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-lg w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-400">
              Initialization Error
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {initError}
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              The application encountered an error during initialization. This may be due to missing environment variables or browser storage issues.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading state until initialization is complete
  if (!initComplete) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {isClient && showMetrics && (
        <div className="bg-accent/30 py-3 border-b border-border/10">
          <ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded p-3 text-center">
                <p className="text-sm font-medium">Contact</p>
                <p className="text-2xl font-bold">{metrics.contactCount}</p>
              </div>
              <div className="bg-background rounded p-3 text-center">
                <p className="text-sm font-medium">Sign-ups</p>
                <p className="text-2xl font-bold">{metrics.userCount}</p>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Main content with corrected spacing for new header height */}
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          <ErrorBoundary fallback={
            <div className="min-h-[85vh] flex items-center justify-center p-8">
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Error Loading Hero Section</h2>
                <p className="mb-6">There was a problem loading the hero section. Other parts of the site may still work.</p>
                <Button onClick={() => window.location.reload()}>Reload Page</Button>
              </div>
            </div>
          }>
            <HeroSection /> {/* Light background (default) */}
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-16 text-center">
              <p>How It Works section failed to load</p>
            </div>
          }>
            <HowItWorksSection /> {/* Dark/accent background */}
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-16 text-center">
              <p>Social Proof section failed to load</p>
            </div>
          }>
            <SocialProofSection /> {/* Light background */} 
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-16 text-center">
              <p>Benefits section failed to load</p>
            </div>
          }>
            <BenefitsSection /> {/* Dark background */}
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-16 text-center">
              <p>Testimonials section failed to load</p>
            </div>
          }>
            <TestimonialsSection /> {/* Light background */}
          </ErrorBoundary>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
