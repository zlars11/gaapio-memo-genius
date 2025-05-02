
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { ResourceCenter } from "@/components/home/ResourceCenter";
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
    
    // Always ensure Sign Up mode is set
    localStorage.setItem("homepageCta", "signup");

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
      
      {/* Main content with new background image positioned as requested */}
      <div className="relative">
        {/* Background image overlay */}
        <div
          className="absolute z-0 w-full"
          style={{
            backgroundImage: `url(${isDark ? "/lovable-uploads/46cd9a78-e198-4c02-8bb3-54dd178bcc07.png" : "/lovable-uploads/46cd9a78-e198-4c02-8bb3-54dd178bcc07.png"})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center 240px',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            opacity: 0.25,
          }}
          aria-hidden="true"
        />
        
        {/* Content sections go on top of the background */}
        <div className="relative z-10">
          <HeroSection />
          <HowItWorksSection />
          <BenefitsSection />
          <TestimonialsSection />
          <SocialProofSection />
          <ResourceCenter />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
