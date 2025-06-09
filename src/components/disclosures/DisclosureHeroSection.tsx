
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { Link } from "react-router-dom";
import { AnimatedDisclosure } from "@/components/home/AnimatedDisclosure";

interface DisclosureHeroSectionProps {
  title?: string;
  subtitle?: string;
}

export const DisclosureHeroSection = memo(function DisclosureHeroSection({ 
  title = "Comprehensive Footnote Disclosures",
  subtitle = "AI-Powered. Compliance-Ready."
}: DisclosureHeroSectionProps) {
  
  return (
    <section className="relative min-h-[100vh] md:min-h-[85vh] flex flex-col justify-center items-center pt-24 pb-20 md:pb-12 bg-white dark:bg-background overflow-hidden">
      <div className="container px-4 md:px-6 text-center relative z-10">
        
        {/* Text content centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" variant="blue" asChild>
              <Link to="/request-demo">Request a Demo</Link>
            </Button>
            <Button size="lg" variant="blueOutline" asChild>
              <Link to="/contact">Ask a Question</Link>
            </Button>
          </div>
        </div>
        
        {/* Animated Disclosure mockup centered */}
        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
          <AnimatedDisclosure />
        </div>
      </div>
    </section>
  );
});
