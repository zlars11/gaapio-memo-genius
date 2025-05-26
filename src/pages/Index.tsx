
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BookOpen, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { setProtectionStatus, setSitePassword, getSessionVersion } from "@/utils/securityUtils";

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

  const products = [
    {
      icon: FileText,
      title: "Accounting Memos",
      description: "AI-powered technical accounting memos for ASC 606, leases, and more",
      href: "/accounting-memos"
    },
    {
      icon: BookOpen,
      title: "Footnote Disclosures",
      description: "Comprehensive and audit-ready footnote disclosures",
      href: "/footnote-disclosures"
    },
    {
      icon: Megaphone,
      title: "Guidance Updates",
      description: "Real-time alerts and insights on accounting standard changes",
      href: "/guidance-updates"
    }
  ];

  const secondaryButtonText = enableSelfSignup ? "Sign Up Now" : "Contact Sales";
  const secondaryButtonLink = enableSelfSignup ? "/signup" : "/contact";

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
      
      {/* Hero Section - White Background */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center pt-24 pb-16 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 flex flex-col items-center relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
              Where GAAP meets AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
              Comprehensive suite of tools for audit-ready memos, disclosures, and guidance updates.
            </p>
            
            {/* 3-Column Product Overview */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {products.map((product) => (
                <div key={product.title} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/20">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-50 rounded-xl mb-4 border border-primary/10">
                      <img 
                        src="/lovable-uploads/4517d8bb-511d-4a58-bdb0-19d826089109.png" 
                        alt={`${product.title} screenshot`}
                        className="h-8 w-8 object-cover rounded"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <Button size="lg" variant="blue" asChild>
                <Link to="/request-demo">Request a demo</Link>
              </Button>
              <Button size="lg" variant="blueOutline" asChild>
                <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mini CTA Section 1 - Memo Focus - Blue Gradient Background */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Spending too many hours preparing technical accounting memos?
              </h2>
              <p className="text-lg text-muted-foreground">
                Let AI handle the drafting so you can focus on high-value work.
              </p>
            </div>
            <div className="ml-8">
              <Button size="lg" variant="blueOutline" asChild>
                <Link to="/accounting-memos">
                  Generate a Memo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mini CTA Section 2 - Disclosure Focus - White Background */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Footnote disclosures slowing down your reporting process?
              </h2>
              <p className="text-lg text-muted-foreground">
                Instantly generate transparent, audit-ready disclosures.
              </p>
            </div>
            <div className="ml-8">
              <Button size="lg" variant="blueOutline" asChild>
                <Link to="/footnote-disclosures">
                  View Disclosure Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mini CTA Section 3 - Guidance Focus - Blue Gradient Background */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Stay ahead of new GAAP and SEC updates — automatically.
              </h2>
              <p className="text-lg text-muted-foreground">
                Get notified about changes that impact your team.
              </p>
            </div>
            <div className="ml-8">
              <Button size="lg" variant="blueOutline" asChild>
                <Link to="/guidance-updates">
                  See How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - White Background */}
      <div className="bg-white dark:bg-background">
        <SocialProofSection />
      </div>

      {/* Testimonials Section - Blue Gradient Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <TestimonialsSection />
      </div>
      
      <Footer />
    </div>
  );
}
