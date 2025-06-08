
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DisclosureHeroSection } from "@/components/disclosures/DisclosureHeroSection";
import { DisclosureHowItWorksSection } from "@/components/disclosures/DisclosureHowItWorksSection";
import { DisclosureBenefitsSection } from "@/components/disclosures/DisclosureBenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";

export default function FootnoteDisclosures() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          {/* Hero Section - White Background with Animated Disclosure */}
          <div className="bg-white dark:bg-background">
            <DisclosureHeroSection 
              title="Comprehensive Footnote Disclosures" 
              subtitle="AI-Powered. Compliance-Ready."
            />
          </div>
          
          {/* How It Works Section - Custom Disclosure Version - Gradient Background */}
          <DisclosureHowItWorksSection />
          
          {/* Social Proof Section - White Background */}
          <div className="bg-white dark:bg-background">
            <SocialProofSection />
          </div>
          
          {/* Benefits Section - Blue Background */}
          <div className="bg-[#339CFF] dark:bg-[#2563eb]">
            <DisclosureBenefitsSection />
          </div>
          
          {/* Testimonials Section - White Background */}
          <div className="bg-white dark:bg-background">
            <TestimonialsSection />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
