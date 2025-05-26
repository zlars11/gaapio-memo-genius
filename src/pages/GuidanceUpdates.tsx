
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";

export default function GuidanceUpdates() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          {/* Hero Section - White Background */}
          <div className="bg-white dark:bg-background">
            <HeroSection 
              title="Stay Current with Guidance Updates" 
              subtitle="AI-Powered. Always Updated."
            />
          </div>
          
          {/* How It Works Section - Blue Gradient Background */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
            <HowItWorksSection />
          </div>
          
          {/* Social Proof Section - White Background */}
          <div className="bg-white dark:bg-background">
            <SocialProofSection />
          </div>
          
          {/* Benefits Section - Blue Gradient Background */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
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
