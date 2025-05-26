
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";

export default function FootnoteDisclosures() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          {/* Hero Section - White Background */}
          <div className="bg-white dark:bg-background">
            <HeroSection 
              title="Comprehensive Footnote Disclosures" 
              subtitle="AI-Powered. Compliance-Ready."
            />
          </div>
          
          {/* How It Works Section - HowItWorks-style Background */}
          <div className="bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
            <HowItWorksSection />
          </div>
          
          {/* Social Proof Section - White Background */}
          <div className="bg-white dark:bg-background">
            <SocialProofSection />
          </div>
          
          {/* Benefits Section - HowItWorks-style Background */}
          <div className="bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
            <BenefitsSection />
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
