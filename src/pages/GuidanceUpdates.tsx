
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GuidanceHeroSection } from "@/components/guidance/GuidanceHeroSection";
import { GuidanceHowItWorksSection } from "@/components/guidance/GuidanceHowItWorksSection";
import { NeverMissUpdateSection } from "@/components/guidance/NeverMissUpdateSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { GuidanceMakesSenseSection } from "@/components/guidance/GuidanceMakesSenseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ExampleUpdateFeedSection } from "@/components/guidance/ExampleUpdateFeedSection";
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
          
          {/* Never Miss Update Section - White Background */}
          <div className="bg-white dark:bg-background">
            <NeverMissUpdateSection />
          </div>
          
          {/* Social Proof Section - White Background */}
          <div className="bg-white dark:bg-background">
            <SocialProofSection />
          </div>
          
          {/* Guidance Makes Sense Section - Light Background */}
          <div className="bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
            <GuidanceMakesSenseSection />
          </div>
          
          {/* Testimonials Section - White Background */}
          <div className="bg-white dark:bg-background">
            <TestimonialsSection />
          </div>
          
          {/* Example Update Feed Section - White Background */}
          <div className="bg-white dark:bg-background">
            <ExampleUpdateFeedSection />
          </div>
          
          {/* Final CTA Banner - Gradient Background */}
          <FinalCtaBanner />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
