
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
          <HeroSection 
            title="Comprehensive Footnote Disclosures" 
            subtitle="AI-Powered. Compliance-Ready."
          />
          <HowItWorksSection />
          <SocialProofSection />
          <BenefitsSection />
          <TestimonialsSection />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
