
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WaitlistSection } from "@/components/home/WaitlistSection";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
