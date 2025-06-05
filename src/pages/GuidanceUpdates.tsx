
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GuidanceHeroSection } from "@/components/guidance/GuidanceHeroSection";
import { GuidanceHowItWorksSection } from "@/components/guidance/GuidanceHowItWorksSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { NeverMissUpdateSection } from "@/components/guidance/NeverMissUpdateSection";
import { GuidanceMakesSenseSection } from "@/components/guidance/GuidanceMakesSenseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCtaBanner } from "@/components/guidance/FinalCtaBanner";

export default function GuidanceUpdates() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          {/* Hero Section - White Background */}
          <div className="bg-white dark:bg-background">
            <GuidanceHeroSection 
              title="Stay Current with Guidance Updates" 
              subtitle="AI-Powered. Always Updated."
            />
          </div>
          
          {/* How It Works Section - Light Background */}
          <div className="bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
            <GuidanceHowItWorksSection />
          </div>
          
          {/* Social Proof Section - White Background */}
          <div className="bg-white dark:bg-background">
            <SocialProofSection />
          </div>
          
          {/* Never Miss Update Section - Light Background */}
          <div className="bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
            <NeverMissUpdateSection />
          </div>
          
          {/* Guidance Makes Sense Section - White Background */}
          <div className="bg-white dark:bg-background">
            <GuidanceMakesSenseSection />
          </div>
          
          {/* Testimonials Section - Light Background */}
          <div className="bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
            <TestimonialsSection />
          </div>
          
          {/* Final CTA Banner - Light Background */}
          <FinalCtaBanner />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
