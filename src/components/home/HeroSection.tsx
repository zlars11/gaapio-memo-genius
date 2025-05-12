
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedMemo } from "./AnimatedMemo";

export const HeroSection = memo(function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Scroll to How It Works section when arrow is clicked
  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-20 pb-16">
      {/* Hero content - Added more top padding (pt-24) to fix header overlap */}
      <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10 mt-16 sm:mt-20 md:mt-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
          Audit Ready Memos and Disclosures
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl animate-fade-up" style={{ animationDelay: "100ms" }}>
          AI-Powered. CPA-Approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Button size="lg" variant="blue" asChild>
            <Link to="/request-demo">Request a demo</Link>
          </Button>
          <Button size="lg" variant="blueOutline" asChild>
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </div>
      
      {/* Background animated memo - made responsive */}
      <div className="w-full px-4 flex justify-center relative z-0 mb-8 sm:mb-12">
        {isClient && <AnimatedMemo />}
      </div>
      
      {/* Down arrow for scrolling to How It Works section */}
      <div 
        className="animate-fade-up absolute bottom-8" 
        style={{ animationDelay: "300ms" }} 
        onClick={scrollToHowItWorks}
      >
        <ArrowDownCircle className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50 animate-pulse-slow cursor-pointer" aria-hidden="true" />
      </div>
    </section>
  );
});
