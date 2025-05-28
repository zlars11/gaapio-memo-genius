
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { setProtectionStatus, setSitePassword, getSessionVersion } from "@/utils/securityUtils";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductHighlightsSection } from "@/components/home/ProductHighlightsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { ComplianceSecuritySection } from "@/components/home/ComplianceSecuritySection";
import { KeyBenefitsSection } from "@/components/home/KeyBenefitsSection";
import { WhatYoullLearnSection } from "@/components/home/WhatYoullLearnSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function Index() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    contactCount: 0,
    userCount: 0
  });
  const [isClient, setIsClient] = useState(false);
  const [enableSelfSignup, setEnableSelfSignup] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Check if metrics should be displayed
    const shouldShowMetrics = localStorage.getItem("showMetricsOnHomepage") === "true";
    const isAdmin = localStorage.getItem("admin_authenticated") === "true";
    
    setShowMetrics(shouldShowMetrics && isAdmin);
    
    if (shouldShowMetrics && isAdmin) {
      try {
        const contactData = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
        const userData = JSON.parse(localStorage.getItem("userSignups") || "[]");
        
        setMetrics({
          contactCount: contactData.length,
          userCount: userData.length
        });
      } catch (error) {
        console.error("Error loading metrics data:", error);
        setMetrics({
          contactCount: 0,
          userCount: 0
        });
      }
    }
    
    // Load self-signup setting
    const savedSetting = localStorage.getItem("enableSelfSignup");
    setEnableSelfSignup(savedSetting !== null ? savedSetting === "true" : true);
    
    // Initialize settings if not set
    if (localStorage.getItem("enableSelfSignup") === null) {
      localStorage.setItem("enableSelfSignup", "true");
    }
    
    localStorage.setItem("homepageCta", enableSelfSignup ? "signup" : "contact");

    if (localStorage.getItem("password_protection_enabled") === null) {
      setProtectionStatus(false);
    }
    
    if (localStorage.getItem("site_password") === null) {
      setSitePassword("Gaapio2025!");
    }
    
    if (localStorage.getItem("session_version") === null || !getSessionVersion()) {
      localStorage.setItem("session_version", "0");
    }
  }, [enableSelfSignup]);

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
      
      {/* Hero Section */}
      <HeroSection />

      {/* Product Highlights Section */}
      <ProductHighlightsSection />

      {/* Social Proof Section (Trusted by Companies) */}
      <SocialProofSection />

      {/* Compliance & Security Section */}
      <ComplianceSecuritySection />

      {/* Key Benefits Section */}
      <KeyBenefitsSection />

      {/* What You'll Learn Section */}
      <WhatYoullLearnSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA Section */}
      <FinalCtaSection />
      
      <Footer />
    </div>
  );
}
