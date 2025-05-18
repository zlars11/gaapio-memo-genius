
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export default function Index() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    contactCount: 0,
    userCount: 0
  });
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Mark that we're in the client environment
    setIsClient(true);
    
    // Initialize dark mode detection
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
    
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
    const shouldShowMetrics = localStorage.getItem("showMetricsOnHomepage") === "true";
    const isAdmin = localStorage.getItem("admin_authenticated") === "true";
    
    setShowMetrics(shouldShowMetrics && isAdmin);
    
    if (shouldShowMetrics && isAdmin) {
      // Load metrics data
      try {
        const contactData = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
        const userData = JSON.parse(localStorage.getItem("userSignups") || "[]");
        
        setMetrics({
          contactCount: contactData.length,
          userCount: userData.length
        });
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
      localStorage.setItem("enableSelfSignup", "true");
    }
    
    // Set homepageCta based on the self-signup setting
    const enableSelfSignup = localStorage.getItem("enableSelfSignup") !== "false";
    localStorage.setItem("homepageCta", enableSelfSignup ? "signup" : "contact");

    // Initialize password protection settings if not already set
    if (localStorage.getItem("password_protection_enabled") === null) {
      localStorage.setItem("password_protection_enabled", "false");
    }
    
    // Use environment variable for site password
    const defaultPassword = import.meta.env.VITE_SITE_PASSWORD || "";
    if (localStorage.getItem("site_password") === null && defaultPassword) {
      localStorage.setItem("site_password", defaultPassword);
    } else if (localStorage.getItem("site_password") === null) {
      // If no env variable and no existing password, set an empty string
      // This will require admins to set a password
      localStorage.setItem("site_password", "");
    }
    
    if (localStorage.getItem("session_version") === null) {
      localStorage.setItem("session_version", "0");
    }

    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);
  
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
          <HeroSection /> {/* Light background (default) */}
          <HowItWorksSection /> {/* Dark/accent background */}
          <SocialProofSection /> {/* Light background */} 
          <BenefitsSection /> {/* Dark background */}
          <TestimonialsSection /> {/* Light background */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
