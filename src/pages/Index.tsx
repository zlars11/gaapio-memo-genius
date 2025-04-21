
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { WaitlistSection } from "@/components/home/WaitlistSection";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export default function Index() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    waitlistCount: 0,
    contactCount: 0,
    userCount: 0
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're in the client environment
    setIsClient(true);
    
    // Check if metrics should be displayed
    const shouldShowMetrics = localStorage.getItem("showMetricsOnHomepage") === "true";
    const isAdmin = localStorage.getItem("admin_authenticated") === "true";
    
    setShowMetrics(shouldShowMetrics && isAdmin);
    
    if (shouldShowMetrics && isAdmin) {
      // Load metrics data
      try {
        const waitlistData = JSON.parse(localStorage.getItem("waitlistSubmissions") || "[]");
        const contactData = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
        const userData = JSON.parse(localStorage.getItem("userSignups") || "[]");
        
        setMetrics({
          waitlistCount: waitlistData.length,
          contactCount: contactData.length,
          userCount: userData.length
        });
      } catch (error) {
        console.error("Error loading metrics data:", error);
        // Fallback to default values if there's an error
        setMetrics({
          waitlistCount: 0,
          contactCount: 0,
          userCount: 0
        });
      }
    }
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {isClient && showMetrics && (
        <div className="bg-accent/30 py-3 border-b border-border/10">
          <ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background rounded p-3 text-center">
                <p className="text-sm font-medium">Waitlist</p>
                <p className="text-2xl font-bold">{metrics.waitlistCount}</p>
              </div>
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
      
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <SocialProofSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
