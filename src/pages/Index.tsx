
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BookOpen, TrendingUp } from "lucide-react";
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
      description: "AI-powered technical accounting memos that are audit-ready and CPA-approved.",
      href: "/accounting-memos",
      features: ["ASC 606 Revenue Recognition", "Lease Accounting", "Financial Instruments", "Business Combinations"]
    },
    {
      icon: BookOpen,
      title: "Footnote Disclosures",
      description: "Comprehensive footnote disclosures that ensure compliance and transparency.",
      href: "/footnote-disclosures",
      features: ["Risk Disclosures", "Significant Policies", "Subsequent Events", "Fair Value Measurements"]
    },
    {
      icon: TrendingUp,
      title: "Guidance Updates",
      description: "Stay current with the latest accounting guidance updates and educational resources.",
      href: "/guidance-updates",
      features: ["Real-time Updates", "Impact Analysis", "Educational Content", "Implementation Guidance"]
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
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center pt-24 pb-12 dark:bg-background">
        <div className="container px-4 md:px-6 flex flex-col items-center relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
              AI-Powered Accounting Solutions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
              Comprehensive suite of tools for audit-ready memos, disclosures, and guidance updates.
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
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 bg-accent/10 dark:bg-accent/5">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Suite</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-powered solutions for all your accounting documentation needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => {
              const Icon = product.icon;
              return (
                <div key={product.title} className="bg-background rounded-lg p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={product.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SocialProofSection />
      <TestimonialsSection />
      
      <Footer />
    </div>
  );
}
